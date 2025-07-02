import { apiFetch } from "./client";

export const getCategories = () => apiFetch('/template-design/categories')
