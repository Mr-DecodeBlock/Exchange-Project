import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function SelectVariants() {
  const [Token, setToken] = React.useState(0);

  const handleChange = (event) => {
    setToken(event.target.value);
  };

  return (
    <div>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">Token</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={Token}
          onChange={handleChange}
          label="Age"
        >
          <MenuItem value={0}>Ethereum ETH</MenuItem>
          <MenuItem value={10}>Rala Token</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
