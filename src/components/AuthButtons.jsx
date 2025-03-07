"use client";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, register } from "../../redux/authSlice";

export default function AuthButtons() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const handleLogin = () => {
    dispatch(login({ email: "test@example.com", password: "password123", remember_me:false }));
  };

  const handleRegister = () => {
    dispatch(register({ first_name: "Test", last_name: "User", email: "test@example.com", password: "Password123." }));
  };


  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : user ? (
        <div>
          <p>Merhaba, {user.name}!</p>
          <button onClick={handleLogout}>Çıkış Yap</button>
        </div>
      ) : (
        <div className="flex flex-col gap-5 justify-start text-left items-start mt-10">
        <button onClick={handleLogin}>Giriş Yap</button>
        <button onClick={handleRegister}>Kayıt Ol</button></div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
