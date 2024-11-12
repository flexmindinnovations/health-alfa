import {useEffect, useState} from "react";
import {Navbar, NavbarContent, NavbarMenuToggle} from "@nextui-org/react";
import {XIcon, Tally2Icon} from 'lucide-react';
import {motion} from "framer-motion";

export function Header({onSidebarStateChange, isExpanded}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        setIsMenuOpen(isExpanded);
    }, [isExpanded]);
    const handleSidebarToggle = (sidebarState) => {
        setIsMenuOpen(sidebarState);
        onSidebarStateChange(sidebarState);
    }

    const onMenuToggle = () => {
        if (isExpanded) setIsMenuOpen(true);
        else setIsMenuOpen(false);
    }

    return <header className="header w-full h-full bg-[var(--bgColor)]">
        <Navbar className="bg-[var(--bgColor)]" onMenuOpenChange={(event) => handleSidebarToggle(event)}>
            <NavbarContent>
                <NavbarMenuToggle
                    icon={
                        <motion.div
                            animate={{rotate: isMenuOpen ? 90 : 0}}
                            transition={{duration: 0.3, ease: "easeInOut"}}
                        >
                            {isMenuOpen ? <XIcon/> : <Tally2Icon className="flex mt-auto -translate-y-1 -rotate-90"/>}
                        </motion.div>
                    }
                    onClick={onMenuToggle}
                    className="lg:hidden xl:hidden 2xl:hidden"
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                />
                {/*<NavbarBrand>*/}
                {/*    <p className="font-bold text-inherit">Health Alfa</p>*/}
                {/*</NavbarBrand>*/}
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