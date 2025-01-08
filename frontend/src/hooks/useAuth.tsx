import AuthService from "../services/auth.service";

const useAuth = (): boolean => {
  return AuthService.isAuthenticated();
};

export default useAuth;
