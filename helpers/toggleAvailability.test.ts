import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { toggleAvailability } from "./toggleAvailability"; // Ajusta la ruta
import { supabase } from "@/lib/supabase";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

// Mock 
vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe("Service: toggleAvailability", () => {
 
  const createMockChain = () => {
    const chain = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn(),
    };
    return chain;
  };

  let mockChain: ReturnType<typeof createMockChain>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockChain = createMockChain();
    (supabase.from as Mock).mockReturnValue(mockChain);
  });

  /**
   * Scenario: Toggle availability from true to false
   * Given a user with is_available set to true
   * When the toggleAvailability function is called
   * Then it should update the database to false and return the updated profile
   */
  it("should change is_available to false when current state is true", async () => {
    const userId = "user-123";
    const currentState = true;
    const mockUpdatedData = { id: userId, is_available: false };

   
    mockChain.single.mockResolvedValue({
      data: mockUpdatedData,
      error: null,
      success: true,
    } as PostgrestSingleResponse<typeof mockUpdatedData>);

    const result = await toggleAvailability(userId, currentState);

   
    expect(result).toEqual(mockUpdatedData);
    expect(result.is_available).toBe(false);

    
    expect(supabase.from).toHaveBeenCalledWith("profiles");
    expect(mockChain.update).toHaveBeenCalledWith({ is_available: false });
    expect(mockChain.eq).toHaveBeenCalledWith("id", userId);
  });

  /**
   * Scenario: Handle database error
   * Given a network or database issue
   * When the toggleAvailability function is called
   * Then it should throw the error returned by Supabase
   */
  it("should throw an error if the database update fails", async () => {
    const mockError = { message: "Database update failed", code: "500" };

    mockChain.single.mockResolvedValue({
      data: null,
      error: mockError,
      success: false,
    } as PostgrestSingleResponse<null>);

  
    await expect(toggleAvailability("123", true)).rejects.toEqual(mockError);
  });

  /**
   * Scenario: Toggle availability from false to true
   * Given a user with is_available set to false
   * When the function is called
   * Then the update payload should be true
   */
  it("should change is_available to true when current state is false", async () => {
    const userId = "user-456";
    const currentState = false;

    mockChain.single.mockResolvedValue({
      data: { id: userId, is_available: true },
      error: null,
      success: true,
    } as PostgrestSingleResponse<{ id: string; is_available: boolean }>);

    await toggleAvailability(userId, currentState);

    expect(mockChain.update).toHaveBeenCalledWith({ is_available: true });
  });
});