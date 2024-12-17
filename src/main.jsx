import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ApiConfigProvider } from '@contexts/ApiConfigContext'
import { AuthProvider } from '@contexts/AuthContext'
import { ErrorBoundary } from '@components/ErrorBoundary'
import { NextUIProvider } from '@nextui-org/react'
import { DeviceProvider } from '@hooks/device-detector'
import './i18n'
import { createTheme, DirectionProvider, Loader, MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import RingLoader from '@components/RingLoader'
import '@mantine/core/styles.css'
import 'mantine-datatable/styles.layer.css'
import '@mantine/notifications/styles.css'
import '@mantine/carousel/styles.css';
import '@mantine/dates/styles.css';
import { ModalsProvider } from "@mantine/modals";

export const notificationAudio = new Audio('/sounds/notification.wav')
notificationAudio.load();
const defaultFize = '12px'

const theme = createTheme({
    fontFamily: `'Poppins', sans-serif`,
    headings: { fontFamily: `'Poppins', sans-serif` },
    colors: {
        brand: [
            '#effafc', '#d6f1f7', '#b2e4ef', '#7dcee3', '#41b0cf',
            '#2594b5', '#227798', '#22617c', '#245066', '#224557', '#143345'
        ],
        primary: [
            '#fff9ea', '#ffeec5', '#ffdc86', '#ffc346', '#ffab1c',
            '#f17e01', '#e16000', '#bb3e02', '#973009', '#7c280b', '#481100'
        ],
        secondary: [
            '#e6f0ff', '#cce0ff', '#99c2ff', '#66a3ff', '#3385ff',
            '#0066ff', '#0059e6', '#004dcc', '#0040b3', '#003399'
        ]
    },
    primaryColor: 'brand',
    primaryShade: 9,
    defaultRadius: 'lg',
    components: {
        Loader: Loader.extend({
            defaultProps: {
                loaders: { ...Loader.defaultLoaders, ring: RingLoader },
                type: 'ring',
                size: 'xl'
            }
        }),
        Input: {
            defaultProps: {
                radius: 'xl',
                fz: defaultFize
            },
            styles: (theme) => ({
                label: {
                    marginBottom: '4px',
                    marginLeft: '0.5rem'
                },
                error: {
                    fontSize: '12px',
                    color: theme.colors.red[6],
                    marginTop: '4px',
                    marginLeft: '0.5rem'
                },
            })
        },
        TextInput: {
            defaultProps: {
                mh: '6rem',
                fz: defaultFize
            },
            styles: (theme) => ({
                label: {
                    marginBottom: '4px',
                    marginLeft: '0.5rem',
                    fontWeight: 'normal',
                    fontSize: defaultFize,
                },
                error: {
                    fontSize: '12px',
                    color: theme.colors.red[6],
                    marginTop: '4px',
                    marginLeft: '0.5rem'
                },
            })
        },
        NumberInput: {
            defaultProps: {
                mh: '6rem'
            },
            styles: (theme) => ({
                label: {
                    marginBottom: '4px',
                    marginLeft: '0.5rem',
                    fontWeight: 'normal',
                    fontSize: defaultFize,
                },
                error: {
                    fontSize: '12px',
                    color: theme.colors.red[6],
                    marginTop: '4px',
                    marginLeft: '0.5rem'
                },
            })
        },
        PasswordInput: {
            defaultProps: {
                radius: 'xl',
                mh: '6rem'
            },
            styles: (theme) => ({
                label: {
                    marginBottom: '4px',
                    marginLeft: '0.7rem'
                },
                error: {
                    fontSize: '12px',
                    color: theme.colors.red[6],
                    marginTop: '4px',
                    marginLeft: '0.7rem'
                },
            })
        },
        FileInput: {
            defaultProps: {
                mh: '6rem'
            },
            styles: (theme) => ({
                label: {
                    marginBottom: '4px',
                    marginLeft: '0.5rem',
                    fontWeight: 'normal',
                    fontSize: '12px',
                },
                error: {
                    fontSize: '12px',
                    color: theme.colors.red[6],
                    marginTop: '4px',
                    marginLeft: '0.5rem'
                },
            })
        },
        Textarea: {
            defaultProps: {
                radius: 'lg',
            },
            styles: (theme) => ({
                label: {
                    marginBottom: '4px',
                    marginLeft: '0.5rem',
                    fontWeight: 'normal',
                    fontSize: defaultFize
                },
                error: {
                    fontSize: '12px',
                    color: theme.colors.red[6],
                    marginTop: '4px',
                    marginLeft: '0.5rem'
                },
            })
        },
        MultiSelect: {
            defaultProps: {
                checkIconPosition: 'right',
                searchable: true,
                clearable: true,
                // hidePickedOptions: true,
                // maxValues: 3,
                nothingFoundMessage: "Nothing found..."
            },
            styles: (theme) => ({
                label: {
                    marginBottom: '4px',
                    marginLeft: '0.5rem',
                    fontWeight: 'normal',
                    fontSize: defaultFize
                },
                error: {
                    fontSize: '12px',
                    color: theme.colors.red[6],
                    marginTop: '4px',
                    marginLeft: '0.5rem'
                },
            })
        },
        Button: {
            defaultProps: {
                radius: 'xl',
                loaderProps: { h: '48px', w: '48px' }
            },
        },
        Tooltip: {
            defaultProps: {
                withArrow: true
            },
            styles: (theme) => ({
                tooltip: {
                    fontSize: '12px'
                }
            })
        },
        Portal: {
            defaultProps: {
                target: '#portalRoot'
            }
        },
        Modal: {
            defaultProps: {
                styles: {
                    inner: {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        translate: '-50% -50%'
                    }
                }
            }
        },
        Container: {
            defaultProps: {
                m: 0,
                p: 0,
                max: '100%',
                w: '100%',
                h: '100%',
                size: 'xl'
            }
        },
        Select: {
            defaultProps: {
                mh: '6rem',
                checkIconPosition: 'right',
                searchable: true,
                clearable: true,
                nothingFoundMessage: "Nothing found..."
            },
            styles: (theme) => ({
                label: {
                    marginBottom: '4px',
                    marginLeft: '0.5rem',
                    fontWeight: 'normal',
                    fontSize: defaultFize,
                },
                error: {
                    fontSize: '12px',
                    color: theme.colors.red[6],
                    marginTop: '4px',
                    marginLeft: '0.5rem'
                },
            })
        },
        DateInput: {
            defaultProps: {
                mh: '6rem'
            },
            styles: (theme) => ({
                label: {
                    marginBottom: '4px',
                    marginLeft: '0.5rem',
                    fontWeight: 'normal',
                    fontSize: defaultFize,
                },
                error: {
                    fontSize: '12px',
                    color: theme.colors.red[6],
                    marginTop: '4px',
                    marginLeft: '0.5rem'
                },
            })
        }
    }
})

function AppWrapper() {
    return (

        <MantineProvider
            theme={theme}
            withGlobalStyles
            withNormalizeCSS
        >
            <Notifications position='top-right' zIndex={9999} />
            <ModalsProvider
                modalProps={{
                    withCloseButton: false,
                    radius: 'lg',
                }}
            >
                <Suspense>
                    <App />
                </Suspense>
            </ModalsProvider>

        </MantineProvider>
    )
}

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
    <StrictMode>
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
            }}
        >
            <DirectionProvider>
                <NextUIProvider className='!h-full'>
                    <ErrorBoundary>
                        <ApiConfigProvider>
                            <AuthProvider>
                                <DeviceProvider>
                                    <AppWrapper />
                                </DeviceProvider>
                            </AuthProvider>
                        </ApiConfigProvider>
                    </ErrorBoundary>
                </NextUIProvider>
            </DirectionProvider>
        </BrowserRouter>
    </StrictMode>
)
