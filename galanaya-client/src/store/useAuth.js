import { useSelector } from "react-redux";

export default function useAuth() {
  const { user, token, roles, permissions, is_active } = useSelector((state) => state.auth);
  return { user, token, roles, permissions, is_active };
}
