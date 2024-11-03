import {useState} from "react";
import {Button, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle} from "@nextui-org/react";

export function Header({onSidebarStateChange}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSidebarToggle = (sidebarState) => {
        setIsMenuOpen(sidebarState);
        onSidebarStateChange(sidebarState);
    }

    return <header className="header w-full h-full bg-[var(--bgColor)]">
        <Navbar className="bg-[var(--bgColor)]" onMenuOpenChange={(event) => handleSidebarToggle(event)}>
            <NavbarContent>
                <NavbarMenuToggle className="lg:hidden xl:hidden 2xl:hidden"
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                />
                <NavbarBrand>
                    <p className="font-bold text-inherit">Health Alfa</p>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                {/*<NavbarItem>*/}
                {/*    <Link color="foreground" href="#">*/}
                {/*        Features*/}
                {/*    </Link>*/}
                {/*</NavbarItem>*/}
            </NavbarContent>
            <NavbarContent justify="end">
                {/*<NavbarItem className="hidden lg:flex">*/}
                {/*    <Link href="#">Login</Link>*/}
                {/*</NavbarItem>*/}
                {/*<NavbarItem>*/}
                {/*    <Button as={Link} color="primary" href="#" variant="flat">*/}
                {/*        Sign Up*/}
                {/*    </Button>*/}
                {/*</NavbarItem>*/}
            </NavbarContent>
        </Navbar>
    </header>
}