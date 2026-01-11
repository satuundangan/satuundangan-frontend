import { apiFetch } from "./client";

export const getCategories = () => apiFetch('/categories')