import styles from '../styles/login.module.css';
import {useForm} from "react-hook-form";
import {Button, Card, CardBody, CardHeader, Input, Link} from "@nextui-org/react";
import {useState} from "react";
import http from '@hooks/axios-instance.js';
import {useApiConfig} from "@contexts/ApiConfigContext.jsx";
import toast from "react-hot-toast";
import {Eye, EyeOff, Lock} from 'lucide-react';
import {motion, useInView} from "framer-motion";


export default function Login() {
    const { ref, inView } = useInView({
        threshold: .8
    })
    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isValid
        }, trigger
    }
        = useForm({mode: "onChange"});

    const [isLoading, setIsLoading] = useState(false);
    const [apiState, setApiState] = useState("primary");
    const [isVisible, setIsVisible] = useState(false);
    const apiConfig = useApiConfig();

    const toggleVisibility = () => setIsVisible(!isVisible);

    const onSubmit = async (data) => {
        setIsLoading(true);
        const payload = {
            customerUserName: data["email"],
            customerPassword: data["password"]
        };
        try {
            const {data} = await http.post(apiConfig.user.login, payload);
            if (data) {
                console.log('data', data);
            }

        } catch (error) {
            const errorMessage = error.message;
            toast.error(errorMessage);
            setApiState("danger");
        } finally {
            setIsLoading(false);
        }
    };

    const passwordToggleComponent = () => (
        <button
            className="focus:outline-none"
            type="button"
            onClick={toggleVisibility}
            aria-label="toggle password visibility"
        >
            {isVisible ? (
                <Eye className="text-2xl text-default-400 pointer-events-none"/>
            ) : (
                <EyeOff className="text-2xl text-default-400 pointer-events-none"/>
            )}
        </button>
    );

    const getErrorMessage = (error) => error ? error.message : "";


    return (
        <div className={styles.loginPage}>
            <div className={styles.overlay}>
                <motion.div
                    layout
                    ref={ref}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{once: true}}
                    transition={{delay: 0.2, duration: 0.4}}
                    variants={{
                        visible: {opacity: 1, scale: 1},
                        hidden: {opacity: 0, scale: 0}
                    }}

                >
                    <Card className="p-4 !rounded-3xl bg-white shadow-none min-w-96 !w-1/4">
                        <CardHeader className="flex flex-col items-center justify-start gap-2">
                            <motion.h1
                                initial="hidden"
                                whileInView="visible"
                                viewport={{once: true}}
                                transition={{delay: 0.8, duration: 0.4}}
                                variants={{
                                    visible: {opacity: 1, x: 0},
                                    hidden: {opacity: 0, x: "-30px"}
                                }}
                                className="text-start w-full font-semibold text-2xl">
                                Welcome Back!
                            </motion.h1>
                        </CardHeader>
                        <CardBody>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="flex flex-1 flex-col h-full w-full justify-center items-center max-w-xs space-y-6"
                            >
                                <Input
                                    {
                                        ...register("email", {
                                            required: "Username or mobile number is required",
                                            pattern: {
                                                value: /^[0-9]{10}$|^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Please enter a valid mobile number or email address"
                                            }
                                        })}
                                    type="text"
                                    radius="lg"
                                    label="Enter Username or Mobile Number"
                                    isInvalid={!!errors.email}
                                    errorMessage={getErrorMessage(errors.email)}
                                    className="w-full"
                                    onBlur={() => trigger("email")}
                                />
                                <Input
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 4,
                                            message: "Password must be at least 4 characters"
                                        }
                                    })}
                                    label="Password"
                                    isInvalid={!!errors.password}
                                    errorMessage={getErrorMessage(errors.password)}
                                    endContent={passwordToggleComponent()}
                                    type={isVisible ? "text" : "password"}
                                    className="max-w-xs text-white w-full"
                                    onBlur={() => trigger("password")}
                                />
                                <div className="w-full flex items-center justify-between">
                                    <div className="rememberMe"></div>
                                    <Button
                                        startContent={isLoading ? "" : <Lock size={16}/>}
                                        variant="solid"
                                        radius="lg"
                                        fullWidth
                                        size="lg"
                                        color={apiState}
                                        type="submit"
                                        isLoading={isLoading}
                                        isDisabled={!isValid}
                                    >
                                        Login
                                    </Button>
                                </div>
                                <div className="forgot-password flex flex-col w-full gap-2">
                                    <Link href="/register">
                                        <p className="text-sm w-full text-center font-semibold">Reset Password!</p>
                                    </Link>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}