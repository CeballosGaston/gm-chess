import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { profileService } from "./queries";
import { supabase } from "@/lib/supabase";
import { Profile } from "../../../types/index";
import { User} from "@supabase/supabase-js";


interface SupabaseChainMock {
  select: Mock;
  eq: Mock;
  single: Mock;
  order: Mock;
}

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn(),
    },
  },
}));

describe("profileService", () => {
 
  const mockChain: SupabaseChainMock = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    order: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockChain.select.mockReturnThis();
    mockChain.eq.mockReturnThis();
    
   
    vi.mocked(supabase.from).mockReturnValue(mockChain as unknown as ReturnType<typeof supabase.from>);
  });

  /**
   * Scenario: Successfully fetching all GMs
   */
  it("Given a list of GMs, When getGMs is called, Then it should return data from Supabase", async () => {
    const mockData: Profile[] = [{ id: "1", name: "GM 1" } as Profile];
    
    mockChain.order.mockResolvedValue({ data: mockData, error: null });

    const result = await profileService.getGMs();

    expect(supabase.from).toHaveBeenCalledWith("profiles");
    expect(result).toEqual(mockData);
  });

  /**
   * Scenario: Getting Current User with fallback
   */
  it("Given auth exists but no DB profile, When getCurrentUser is called, Then it should return a fallback user", async () => {
    const mockAuthUser = {
      id: "user-123",
      user_metadata: { full_name: "Test User", avatar_url: "url-image" }
    } as unknown as User;

    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: mockAuthUser },
      error: null,
    });

    mockChain.single.mockResolvedValue({ 
      data: null, 
      error: { message: "Not found", details: "", hint: "", code: "PGRST116" } 
    });

    const result = await profileService.getCurrentUser();

    expect(result).not.toBeNull();
    expect(result?.name).toBe("Test User");
    expect(result?.role).toBe("user");
  });

  /**
   * Scenario: Merging DB profile and Auth metadata
   */
  it("Given a DB profile exists, When getCurrentUser is called, Then it should merge auth metadata with DB data", async () => {
    const mockAuthUser = {
      id: "user-123",
      user_metadata: { picture: "auth-picture" }
    } as unknown as User;

    const mockDbProfile = {
      id: "user-123",
      name: "DB Name",
      role: "gm",
    } as Profile;

    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: mockAuthUser },
      error: null,
    });

    mockChain.single.mockResolvedValue({ data: mockDbProfile, error: null });

    const result = await profileService.getCurrentUser();

    expect(result?.name).toBe("DB Name");
    expect(result?.avatar_url).toBe("auth-picture");
  });

  /**
   * Scenario: Fetching a single GM fails
   */
  it("Given an error in Supabase, When getGmById is called, Then it should return null", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    
    mockChain.single.mockResolvedValue({ 
      data: null, 
      error: { message: "Error", details: "Details" } 
    });

    const result = await profileService.getGmById("invalid-id");

    expect(result).toBeNull();
  });
});