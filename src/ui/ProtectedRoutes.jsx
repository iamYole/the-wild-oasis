import styled from "styled-components";
import { useAuth } from "../features/authentication/useAuth";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const FullPage = styled.div`
  height: 100dh;
  background-color: var(--color-gray-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;

function ProtectedRoutes({ children }) {
  const navigate = useNavigate();
  // Load authenticated User
  const { isAuthenticated, isLoading } = useAuth();

  // If authentication fails, redirect to login page /login
  useEffect(
    function () {
      if (!isAuthenticated && !isLoading) navigate("/login");
    },
    [isAuthenticated, isLoading, navigate],
  );

  // Display a Spinner while loading
  if (isLoading)
    return (
      <FullPage>
        <Spinner />;
      </FullPage>
    );

  if (isAuthenticated) return children;
}

export default ProtectedRoutes;
