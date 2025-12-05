import { fetchFacultadesByBooks } from "@/lib/data/faculty.data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { buttonVariants } from "../ui/button";
import ScrollLink from "../scroll-link";

export default async function Footer() {
  const facultades = await fetchFacultadesByBooks();

  const menuItems = [
    { label: "Fecha de publicación", href: "/books/anio" },
    { label: "Autor", href: "/books/author" },
    { label: "Carreras", href: "/books/career" },
    { label: "Especialidades", href: "/books/speciality" },
    {
      label: "Palabras clave",
      href: "/books/keywords",
    },
  ];

  const handleScrollToTop = () => {
    // Usamos setTimeout(0) para asegurarnos de que se ejecute después
    // de cualquier lógica de navegación o renderizado.
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  };

  return (
    <footer className="border-t  from-white/50 to-gray-50 mt-10">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-3">
          {/* Brand + description */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-blue-600 p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="h-6 w-6"
                >
                  <path d="M3 5.25C3 4.00736 4.00736 3 5.25 3h13.5C19.9926 3 21 4.00736 21 5.25v13.5c0 1.2426-1.0074 2.25-2.25 2.25H5.25A2.25 2.25 0 013 18.75V5.25zM8.5 8.5h7v1.5h-7V8.5zm0 3.75h7v1.5h-7v-1.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Biblioteca</h3>
                <p className="text-sm text-muted-foreground">
                  Recursos académicos y libros.
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm">
              Accede a guías, PDFs y materiales seleccionados por facultad y
              carrera. Diseñado para estudiantes y profesores.
            </p>
          </div>

          {/* Links columns */}
          <div className="grid grid-cols-1 gap-6 md:col-span-2 md:grid-cols-3">
            <div>
              <h4 className="mb-3 text-sm font-semibold">Explorar</h4>
              <ul className="space-y-2 text-sm">
                {menuItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(buttonVariants({ variant: "link" }))}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold">Facultades</h4>
              <ul className="space-y-2 text-sm">
                {facultades.map((fac) => {
                  const href = `/search?facultadId=${fac.id}`;
                  return (
                    <li key={fac.id}>
                      <ScrollLink // <-- USAR SCROLLLINK
                        href={href}
                        className={cn(buttonVariants({ variant: "link" }))} // ❌ Eliminar scroll={true}
                      >
                        {fac.nombre}

                        <Badge variant="secondary" className="ml-2">
                          {fac.total_libros && fac.total_libros}
                        </Badge>
                      </ScrollLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-start border-t py-6 text-sm gap-1">
          <p>Biblioteca</p> © 2025 by
          <a
            href="https://github.com/abrahamLeVe/library-uc-web"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            abrahamLeVe
          </a>
          <p>is licensed under </p>
          <a
            href="https://creativecommons.org/licenses/by-nc/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            CC BY-NC 4.0
          </a>
          <img
            src="https://mirrors.creativecommons.org/presskit/icons/cc.svg"
            alt="Creative Commons"
            style={{ maxWidth: "1em", maxHeight: "1em", marginLeft: ".2em" }}
          />
          <img
            src="https://mirrors.creativecommons.org/presskit/icons/by.svg"
            alt="Atribución"
            style={{ maxWidth: "1em", maxHeight: "1em", marginLeft: ".2em" }}
          />
          <img
            src="https://mirrors.creativecommons.org/presskit/icons/nc.svg"
            alt="No Comercial"
            style={{ maxWidth: "1em", maxHeight: "1em", marginLeft: ".2em" }}
          />
        </div>
      </div>
    </footer>
  );
}
