import { beforeEach, describe, expect, it } from "vitest";
import { getCondominioIdActual, setStoredUser } from "@/utils/authStorage";

describe("condominio activo", () => {
  beforeEach(() => sessionStorage.clear());

  it("no inventa condominio cuando la asignación está pendiente", () => {
    setStoredUser({ nombre: "Ana", role: "residente", unidad: "Sin unidad asignada" });
    expect(getCondominioIdActual()).toBe("");
  });
});
