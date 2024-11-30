import { Button } from "@mantine/core";

/**
 * @typedef {import("@mantine/core").ButtonProps} ButtonProps
 */

/**
 * Custom Button component
 * @param {ButtonProps & { title?: string }} props - Props for the component
 */
export function CButton({ children, ...rest }) {
    return (
        <Button
            loaderProps={{ h: '48px', w: '48px' }}
            radius={"md"}
            {...rest}
        >
            {children}
        </Button>
    );
}
