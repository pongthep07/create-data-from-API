import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';


interface User {
  id: number;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female';
  age: number;
  hairColor: string;
  department: string;
  postalCode: string;
  company : {
    address: {
      postalCode : string
    }
    department : string
  }
  hair : {
    color : string
  }
}

interface DepartmentSummary {
  male: number;
  female: number;
  ageRange: string;
  hair: Record<string, number>;
  addressUser: Record<string, string>;
}

function App() {


  const [departmentSummary, setDepartmentSummary] = useState<Record<string, DepartmentSummary>>({});
  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async () => {
    try {
      const response = await axios.get('https://dummyjson.com/users');
      const users = response.data.users as User[];
      const summary = transformData(users);
      setDepartmentSummary(summary);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const transformData = (users: User[]): Record<string, DepartmentSummary> => {
    const summary: Record<string, DepartmentSummary> = {};

    users.forEach(user => {
      const department = user.company.department;

      if (!summary[department]) {
        summary[department] = {
          male: 0,
          female: 0,
          ageRange: '',
          hair: {},
          addressUser: {}
        };
      }

      const departmentSummary = summary[department];

      if (user.gender === 'male') {
        departmentSummary.male++;
      } else {
        departmentSummary.female++;
      }

      const ageRange = `${Math.floor(user.age / 10) * 10}-${Math.floor(user.age / 10) * 10 + 9}`;
      if (!departmentSummary.ageRange) {
        departmentSummary.ageRange = ageRange;
      }

      if (!departmentSummary.hair[user.hair.color]) {
        departmentSummary.hair[user.hair.color] = 1;
      } else {
        departmentSummary.hair[user.hair.color]++;
      }

      departmentSummary.addressUser[`${user.firstName}${user.lastName}`] = user.company.address.postalCode;
    });

    return summary;
  };
  return (
    <div className="App">
      <div>
        {Object.entries(departmentSummary).map(([department, summary]) => (
          <div key={department}>
            <h2>{department}</h2>
            <p>Male: {summary.male}</p>
            <p>Female: {summary.female}</p>
            <p>Age Range: {summary.ageRange}</p>
            <p>Hair:</p>
            <ul>
              {Object.entries(summary.hair).map(([color, count]) => (
                <li key={color}>
                  {color}: {count}
                </li>
              ))}
            </ul>
            <p>Address Summary:</p>
            <ul>
              {Object.entries(summary.addressUser).map(([name, postalCode]) => (
                <li key={name}>
                  {name}: {postalCode}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
