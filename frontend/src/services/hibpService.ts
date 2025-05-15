import axios from 'axios';

const HIBP_API_BASE_URL = 'https://api.pwnedpasswords.com';

export interface PasswordCheckResult {
  isCompromised: boolean;
  count?: number;
}

export const checkPassword = async (password: string): Promise<PasswordCheckResult> => {
  try {
    // First, we need to hash the password using SHA-1
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

    // We only need the first 5 characters of the hash for the API call
    const prefix = hashHex.substring(0, 5);
    const suffix = hashHex.substring(5);

    const response = await axios.get(`${HIBP_API_BASE_URL}/range/${prefix}`);

    // The response is a list of hashes and their counts
    const hashes = response.data.split('\r\n');
    const match = hashes.find((line: string) => line.startsWith(suffix));

    if (match) {
      const count = parseInt(match.split(':')[1]);
      return {
        isCompromised: true,
        count
      };
    }

    return {
      isCompromised: false
    };
  } catch (error) {
    console.error('Error checking password:', error);
    throw error;
  }
}; 