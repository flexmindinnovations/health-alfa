import {createTheme, Loader} from '@mantine/core';
import RingLoader from '@components/RingLoader'

const defaultSize = '12px';
const defaultRadius = 'lg';
const defaultRadiusTextArea = 'lg';

export const theme = createTheme({
    fontFamily: `'Poppins', sans-serif`,
    headings: {fontFamily: `'Poppins', sans-serif`},
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
    defaultRadius,
    components: {
        Loader: Loader.extend({
            defaultProps: {
                loaders: {...Loader.defaultLoaders, ring: RingLoader},
                type: 'ring',
                size: 'xl'
            }
        }),
        Input: {
            defaultProps: {
                fz: defaultSize
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
                fz: defaultSize
            },
            styles: (theme) => ({
                label: {
                    marginBottom: '4px',
                    marginLeft: '0.5rem',
                    fontWeight: 'normal',
                    fontSize: defaultSize,
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
                    fontSize: defaultSize,
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
                radius: defaultRadiusTextArea,
            },
            styles: (theme) => ({
                label: {
                    marginBottom: '4px',
                    marginLeft: '0.5rem',
                    fontWeight: 'normal',
                    fontSize: defaultSize
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
                    fontSize: defaultSize
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
                loaderProps: {h: '48px', w: '48px'}
            },
        },
        Tooltip: {
            defaultProps: {
                withArrow: true
            },
            styles: () => ({
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
                    fontSize: defaultSize,
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
                    fontSize: defaultSize,
                },
                error: {
                    fontSize: '12px',
                    color: theme.colors.red[6],
                    marginTop: '4px',
                    marginLeft: '0.5rem'
                },
            })
        },
        TimeInput: {
            defaultProps: {
                mh: '6rem'
            },
            styles: (theme) => ({
                label: {
                    marginBottom: '4px',
                    marginLeft: '0.5rem',
                    fontWeight: 'normal',
                    fontSize: defaultSize,
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