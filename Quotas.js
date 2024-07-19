import React, { useState, useRef } from 'react';
import { 
  Typography, 
  Button, 
  Box, 
  Chip, 
  IconButton, 
  Tooltip, 
  Menu, 
  MenuItem,
  Popper, 
  Paper, 
  List, 
  ListItem, 
  Grow,
  ListItemText 
} from '@mui/material';
import { 
  FilterList as FilterListIcon,
  ChevronRight as ChevronRightIcon,
  Clear as ClearIcon,
  LocalOffer as LocalOfferIcon,
  Block as BlockIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
  DateRange as DateRangeIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Pool as PoolIcon,
  Public as PublicIcon,
  Cloud as CloudAccountIcon,
  Storage as StorageIcon,
  Warning as WarningIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material';

// Import the JSON data (assumed to be available)
import formData from './formData.json';

const iconComponents = {
  LocalOffer: LocalOfferIcon,
  Block: BlockIcon,
  Category: CategoryIcon,
  Money: MoneyIcon,
  DateRange: DateRangeIcon,
  Person: PersonIcon,
  Business: BusinessIcon,
  Pool: PoolIcon,
  Public: PublicIcon,
  CloudAccount: CloudAccountIcon,
  Storage: StorageIcon,
  Warning: WarningIcon,
  Lightbulb: LightbulbIcon
};

const colorPalette = {
  primary: '#3f51b5',
  secondary: '#f50057',
  success: '#4caf50',
  warning: '#ff9800',
  info: '#2196f3',
  error: '#f44336',
};

const getRandomColor = () => {
  const colors = Object.values(colorPalette);
  return colors[Math.floor(Math.random() * colors.length)];
};

const FilterFunctionality = () => {
  const [filters, setFilters] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [popperPlacement, setPopperPlacement] = useState('right-start');
  const menuRef = useRef(null);
  const [submenuStyle, setSubmenuStyle] = useState({});
  const submenuRef = useRef(null);
  const [filterColors, setFilterColors] = useState({});
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const timeoutRef = useRef(null);

  const handleFilterChange = (filterKey, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterKey]: value,
    }));
    handleClose();
  };

  const removeFilter = (filterKey) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      delete newFilters[filterKey];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenSubmenu(null);
    setSubmenuAnchorEl(null);
  };

  const handleSubmenuOpen = (event, filterKey) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpenSubmenu(filterKey);
    setSubmenuAnchorEl(event.currentTarget);

    // Calculate available space
    const menuRect = menuRef.current.getBoundingClientRect();
    const itemRect = event.currentTarget.getBoundingClientRect();
    const spaceOnRight = window.innerWidth - itemRect.right;
    const spaceBelow = window.innerHeight - itemRect.bottom;
    const submenuWidth = 200; // Width of the submenu
    const submenuHeight = 300; // Estimated max height of the submenu

    let newPlacement = 'right-start';
    let newStyle = { maxHeight: submenuHeight };

    if (spaceOnRight < submenuWidth) {
      newPlacement = 'left-start';
    }

    if (spaceBelow < submenuHeight) {
      const spaceAbove = itemRect.top;
      if (spaceAbove > spaceBelow) {
        newPlacement = newPlacement.replace('start', 'end');
        newStyle.maxHeight = Math.min(submenuHeight, spaceAbove);
      } else {
        newStyle.maxHeight = Math.min(submenuHeight, spaceBelow);
      }
    }

    setPopperPlacement(newPlacement);
    setSubmenuStyle(newStyle);
  };

  const handleSubmenuClose = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenSubmenu(null);
      setSubmenuAnchorEl(null);
    }, 300);
  };

  const renderFilterValue = (value) => {
    if (value === null) return "Not Set";
    if (typeof value === 'boolean') return value ? "Yes" : "No";
    return value.name || value;
  };
   const getFilterColor = (key) => {
    if (!filterColors[key]) {
      setFilterColors(prev => ({ ...prev, [key]: getRandomColor() }));
    }
    return filterColors[key];
  };

  const getFilterIcon = (key) => {
    const IconComponent = iconComponents[formData.filters[key].icon];
    return IconComponent ? (
      <IconComponent fontSize="small" style={{ color: getFilterColor(key) }} />
    ) : (
      <FilterListIcon fontSize="small" style={{ color: getFilterColor(key) }} />
    );
  };

  return (
    <Box sx={{ width: '300px', marginLeft: 0 }}>
      <Box className="flex justify-between items-center mb-2">
        <Typography variant="subtitle1" className="font-semibold text-gray-700 items-center">
          Filters
        </Typography>
        <Box>
          {Object.keys(filters).length > 1 && (
            <Tooltip title="Clear all filters">
              <IconButton onClick={clearAllFilters} size="small" className="text-gray-500 hover:text-gray-700 mr-2">
                <ClearIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleClick}
            size="small"
            sx={{ color: colorPalette.primary, borderColor: colorPalette.primary }}
          >
            Add Filter
          </Button>
        </Box>
      </Box>
      <Box className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-600">
          {Object.keys(filters).length === 0 ? 'None' : ''}
        </span>
        {Object.entries(filters).map(([key, value]) => (
          <Chip
            key={key}
            icon={getFilterIcon(key)}
            label={`${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${renderFilterValue(value)}`}
            onDelete={() => removeFilter(key)}
            size="small"
            sx={{
              backgroundColor: `${getFilterColor(key)}20`,
              color: getFilterColor(key),
              borderColor: getFilterColor(key),
              '& .MuiChip-deleteIcon': {
                color: getFilterColor(key),
              },
            }}
          />
        ))}
      </Box>

     <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 250,
            '& .MuiMenuItem-root': {
              paddingLeft: 2,
              paddingRight: 2,
            },
          },
          ref: menuRef,
        }}
      >
        <MenuItem disabled sx={{ 
          backgroundColor: colorPalette.primary,
          color: 'white',
          fontWeight: 'bold',
          '&.Mui-disabled': {
            opacity: 1,
            color: 'white',
          }
        }}>
          Filters
        </MenuItem>
        {Object.entries(formData.filters)
          .filter(([key]) => !filters.hasOwnProperty(key))
          .map(([key, filterData]) => (
            <MenuItem
              key={key}
              onMouseEnter={(event) => handleSubmenuOpen(event, key)}
              onMouseLeave={handleSubmenuClose}
              sx={{ position: 'relative' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                {getFilterIcon(key)}
                <Typography variant="body1" noWrap sx={{ ml: 2, color: getFilterColor(key) }}>
                  {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Typography>
              </Box>
              <ChevronRightIcon fontSize="small" sx={{ color: getFilterColor(key) }} />
              {openSubmenu === key && (
                <Popper
                  open={Boolean(openSubmenu)}
                  anchorEl={submenuAnchorEl}
                  placement={popperPlacement}
                  transition
                  sx={{ zIndex: 1301 }}
                >
                  {({ TransitionProps }) => (
                    <Grow {...TransitionProps}>
                      <Paper 
                        ref={submenuRef}
                        onMouseEnter={() => clearTimeout(timeoutRef.current)}
                        onMouseLeave={handleSubmenuClose}
                        sx={{ 
                          width: 200,
                          ...submenuStyle,
                          overflowY: 'auto',
                        }}
                      >
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            p: 1, 
                            backgroundColor: getFilterColor(key),
                            color: 'white',
                            fontWeight: 'bold',
                            position: 'sticky',
                            top: 0,
                            zIndex: 1,
                          }}
                        >
                          {openSubmenu.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Typography>
                        <List dense>
                          {filterData.options.map((option, index) => (
                            <ListItem 
                              button 
                              onClick={() => handleFilterChange(openSubmenu, option)} 
                              key={index}
                            >
                              <ListItemText 
                                primary={renderFilterValue(option)} 
                                sx={{ color: getFilterColor(key) }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              )}
            </MenuItem>
          ))}
      </Menu>
    </Box>
  );
};

export default FilterFunctionality;