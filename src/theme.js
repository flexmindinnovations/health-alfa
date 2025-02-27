import { createTheme, Loader } from '@mantine/core';
import RingLoader from '@components/RingLoader'

const defaultSize = '12px';
const defaultRadius = 'lg';
const defaultRadiusTextArea = 'lg';

export const theme = createTheme({
    fontFamily: `'Poppins', sans-serif`,
    headings: { fontFamily: `'Poppins', sans-serif` },
    colors: {
        brand: [
            "#e4fdfe",
            "#d5f5f7",
            "#aee9ed",
            "#84dde2",
            "#62d2d9",
            "#4cccd3",
            "#3cc9d1",
            "#2ab1b9",
            "#169ea5",
            "#008990"
        ],
        primary: [
            "#FAE4F9", "#F8D8F5", "#F6C6F0", "#F3B3EB", "#F1A1E6",
            "#EE8EE1", "#EB7BDC", "#E867D6", "#E554D1", "#E240CC"
        ],
        secondary: [
            "#E3EDF2",
            "#C7D9E3",
            "#AAC4D5",
            "#8EAFC7",
            "#719AB9",
            "#5585AA",
            "#3F6B8B",
            "#2D5068",
            "#1E3A4D",
            "#143345"
        ],
        error: [
            "#F7D3D3", "#F5C6C6", "#F3B9B9", "#F2ACAC", "#F09F9F",
            "#EE9292", "#EC8585", "#EA7878", "#E86B6B", "#E65E5E"
        ],
        info: [
            "#D6F1F8", "#C5EBF5", "#B4E5F2", "#A3DFEF", "#92D9EC",
            "#81D3E9", "#70CDE6", "#5FC7E3", "#4EC1E0", "#3DBBDC"
        ],
        warning: [
            "#FAE2C0", "#F8D9B0", "#F7D0A0", "#F5C790", "#F3BE80",
            "#F2B570", "#F0AC60", "#EEA350", "#EC9A40", "#EA9130"
        ],
        success: [
            "#D8F3A4", "#C8EE92", "#B8E980", "#A8E46E", "#98DF5C",
            "#88DA4A", "#78D538", "#68D026", "#58CB14", "#48C600"
        ],
    },
    primaryColor: 'secondary',
    primaryShade: 9,
    defaultRadius,
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
                loaderProps: { h: '48px', w: '48px' }
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