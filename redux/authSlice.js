import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://devtools-api.beratcarsi.com";

// Login İşlemi
export const login = createAsyncThunk("auth/token", async ({ email, password, remember_me }, thunkAPI) => {
  try {
    const response = await fetch(`${API_URL}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, remember_me }),
    });

    if (!response.ok) throw new Error("Giriş başarısız!");

    const data = await response.json();
    localStorage.setItem("token", data.accessToken); // Token'ı sakla

    return data;
  } catch (error) {
    console.log(error);
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Kullanıcı Bilgisini Al
export const getUser = createAsyncThunk("auth/getUser", async (_, thunkAPI) => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Kullanıcı doğrulanamadı!");

    return await response.json();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Register İşlemi
export const register = createAsyncThunk("auth/register", async ({ first_name, last_name, email, password }, thunkAPI) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name, last_name, email, password }),
    });

    if (!response.ok) throw new Error("Kayıt başarısız!");

    const data = await response.json();
    localStorage.setItem("token", data.accessToken); // Token'ı sakla

    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Çıkış Yapma
export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token");
  return null;
});

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUser.fulfilled, (state, action) => { state.user = action.payload; })
      .addCase(logout.fulfilled, (state) => { state.user = null; });
  },
});

export default authSlice.reducer;
