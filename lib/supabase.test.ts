import { describe, it, expect } from 'vitest';
import { supabase } from './supabase';

describe('Supabase Client', () => {
  it('should initialize with valid credentials', () => {
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
  });

  it('should be able to call getSession', async () => {
    const { data, error } = await supabase.auth.getSession();
    // Should not throw an error - either returns session or null
    expect(error).toBeNull();
  });
});
