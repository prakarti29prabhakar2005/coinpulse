import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { createTheme, ThemeProvider } from '@mui/material';

const TabsComponents = () => {

    const [value, setValue] = useState('grid');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const style = {
        color: "var(--white)",
        width: "50vw",
        fontSize: "1.2rem",
        fontWeight: 600,
        fontFamily: "Inter",
        textTransform: "capitalize",
    };

    const theme = createTheme({
        palette:{
            primary:{
                main: "#3a80e9",
            },
        },
    });

    return (
        <ThemeProvider theme = {theme}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} variant="fullWidth">
                        <Tab label="Grid" value="grid" sx={style} />
                        <Tab label="List" value="list" sx ={style}/>
                    </TabList>
                </Box>
                <TabPanel value="grid">
                    <div>mapping for grid</div>
                </TabPanel>
                <TabPanel value="list">
                    <div>mapping for lists</div>
                </TabPanel>
            </TabContext>
        </ThemeProvider>
    )
}

export default TabsComponents