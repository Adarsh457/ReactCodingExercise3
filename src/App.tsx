import "./styles.css";
import { useEffect, useReducer, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import users from "./data";
import { ProcessedUser, RawUser } from "./types";

/** Instructions
   0. Fork this codesandbox and sync it with your github 
   1. import users data from data.ts
   1.1. Utilize TypeScript in your implementation
   2. On load:
   2.1. Filter the users data array to only include users where age >= 18
   2.2. Map the users data array to only include username, address, age and companyName
   2.3. Add a new ID to each user object, which should consist of a randomized sequence (6 characters) of the following: {ABCDEF123456}
   2.4. Sort the array (asc) by age, then by companyName
   2.5. Dispatch the data to the local users state
   3. Display the users' properties using a loop in the tsx, preferably in a styled "Card" form
   3.1. Add a "remove" button to each card - this should remove the user from the state
   3.2. Store the removed users in a new state instance
   3.3. Using the second input, add a method to search for a user's username with the onChange event
   3.4. The removed users should also be found if the input is being used to search for a username
   3.5. In the case where a removed user is shown during a search, there should be a "restore" button, which would insert the removed user back into the users array
   4. Extend the reducer:
   4.1. Count must always be >= 0, in all cases
   4.2. Add a case to increment count with a random number, between 1 and 10
   4.3. Add a case to increment to the nearest odd number, if already odd - increment to next odd
   4.4. Add a case to decrease the count by the input of the first textfield
   4.5. Add a case to reset the count
   4.6. Add buttons to said cases
   4.7. Add styling using MUI
   5. Provide the link to your forked repo with your answers
   */

// Reducder Function
function reducer(
  state: number,
  action: { type: string; payload?: number }
): number {
  switch (action.type) {
    // Increment Counter By Random Values
    case "INCREMENT_RANDOM": {
      const rand = Math.floor(Math.random() * 10) + 1;
      return state + rand;
    }

    // Increment Counter By Nearest Odd Values
    case "INCREMENT_ODD": {
      return state % 2 === 0 ? state + 1 : state + 2;
    }

    // Decrement the Input Box Value from the Counter
    case "DECREMENT_BY_INPUT": {
      const value = action.payload ?? 0;
      return Math.max(0, state - value);
    }
    // Reset Counter Value
    case "RESET":
      return 0;
    default:
      return state;
  }
}

export default function App() {
  const [usersData, setUsersData] = useState<ProcessedUser[]>([]);
  const [removedUsers, setRemovedUsers] = useState<ProcessedUser[]>([]);
  const [numberInput, setNumberInput] = useState(0);
  const [text] = useState("");
  const [search, setSearch] = useState("");
  const [count, dispatch] = useReducer(reducer, 0);

  const allowedChars = "ABCDEF123456";
  // Generates the Random ID.
  const getRandomId = (): string => {
    let id = "";
    for (let i = 0; i < 6; i++) {
      id += allowedChars[Math.floor(Math.random() * allowedChars.length)];
    }
    return id;
  };
  useEffect(() => {
    // Filtering the users in accending order by username, address, age and company name.
    const filteredUsers: ProcessedUser[] = users
      .filter((user: RawUser) => user.age >= 18)
      .map((user: RawUser) => ({
        id: getRandomId(),
        username: user.username,
        address: user.address,
        age: user.age,
        companyName: user.company.name,
      }))
      .sort((a, b) => {
        if (a.age !== b.age) return a.age - b.age;
        return a.companyName.localeCompare(b.companyName);
      });

    setUsersData(filteredUsers);
  }, []);

  // Removing the selected users from the list.
  const handleRemove = (id: string) => {
    const user = usersData.find((u) => u.id === id);
    if (!user) return;
    setUsersData(usersData.filter((u) => u.id !== id));
    setRemovedUsers([...removedUsers, user]);
  };

  // Restoring the removed user from the list.
  const handleRestore = (id: string) => {
    const user = removedUsers.find((u) => u.id === id);
    if (!user) return;
    setRemovedUsers(removedUsers.filter((u) => u.id !== id));
    setUsersData([...usersData, user]);
  };

  // Searching for the user
  const filteredList = usersData.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  // Searching for the removed user
  const filteredRemovedUsers = removedUsers.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  // Setting the FinalList. Based on search query
  const finalList = search
    ? [...filteredList, ...filteredRemovedUsers]
    : usersData;
  return (
    <div className="App">
      <p style={{ marginBottom: 0 }}>Count: {count}</p>
      <TextField
        value={numberInput}
        type="number"
        sx={{ mb: 2 }}
        onChange={(e) => {
          const num = parseInt(e.target.value);
          setNumberInput(num);
        }}
        style={{ display: "block" }}
      />
      <Box
        sx={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          justifyContent: "center",
          mb: 4,
        }}
      >
        <Button
          variant="contained"
          onClick={() => dispatch({ type: "INCREMENT_RANDOM" })}
        >
          + Random
        </Button>
        <Button
          variant="contained"
          onClick={() => dispatch({ type: "INCREMENT_ODD" })}
        >
          + Nearest Odd
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            dispatch({ type: "DECREMENT_BY_INPUT", payload: numberInput })
          }
        >
          - Input
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setNumberInput(0);
            dispatch({ type: "RESET" });
          }}
        >
          Reset
        </Button>
      </Box>
      <hr />
      <p style={{ marginBottom: 0, marginTop: 30 }}>Search for a user</p>
      <TextField
        defaultValue={text}
        sx={{ mb: 2 }}
        margin="normal"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Grid container spacing={3}>
        {finalList.map((user) => (
          <Grid key={user.id} size={{ xs: 12, md: 3 }}>
            <Card
              sx={{
                border: removedUsers.find((u) => u.id === user.id)
                  ? "2px solid red"
                  : "",
              }}
            >
              <CardContent>
                <Typography variant="h6">{user.username}</Typography>
                <Typography>Age: {user.age}</Typography>
                <Typography>Company: {user.companyName}</Typography>
                <Typography>
                  Address: {user.address.street}, {user.address.city}
                </Typography>
                <Button
                  variant="contained"
                  color={
                    removedUsers.some((u) => u.id === user.id)
                      ? "success"
                      : "error"
                  }
                  onClick={() => {
                    if (removedUsers.some((u) => u.id === user.id)) {
                      handleRestore(user.id);
                    } else {
                      handleRemove(user.id);
                    }
                  }}
                >
                  {removedUsers.some((u) => u.id === user.id)
                    ? "Restore"
                    : "Remove"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
