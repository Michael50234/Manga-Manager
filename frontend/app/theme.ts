import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: 'hsl(232, 61, 72)',
            // Hover color
            dark: 'hsl(232, 61, 60)'
        },
        secondary: {
            main: 'hsl(52, 61, 72)',
            // Hover color
            dark: 'hsl(52, 61, 60)',
        },
        background: {
            default: 'hsl(240, 18, 98)',
            paper: 'hsl(240, 18, 94)',
        },
        text: {
            primary: 'hsl(0, 0, 9)',
            secondary: 'hsl(0, 0, 25)',
        }
    },
    typography: {
        fontSize: 16,
        fontFamily: 'var(--font-poppins), sans-serif'
    }, 
    components: {
        // MuiButton: {
        //     defaultProps: {

        //     }, 
        //     styleOverrides: {
        //         containedPrimary: {

        //         }
                
        //     }
        // }

    }


})