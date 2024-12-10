import {
    createClient
 } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
 
 const supabaseUrl = 'https://lkuxnhuapdjdenizmfpj.supabase.co';
 const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrdXhuaHVhcGRqZGVuaXptZnBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2NTE3MDgsImV4cCI6MjA0NzIyNzcwOH0.cfAWo1kCvAxCfi8EMJgpeULaETciB2ocy8o5KmKn--k';
 const supabase = createClient(supabaseUrl, supabaseKey);
 
 window.user = {};
 const redirectURL = null;
 
 // check authentication status
 async function checkAuth() {
    try {
       const {
          data: {
             session
          }
       } = await supabase.auth.getSession();
 
       if (session && session.user) {
          // User is signed in, fetch the user data
          user.userId = session.user.id;
 
          // Wait for fetchUserData to resolve or reject
          user.userDetails = await fetchUserData(userId, 'students'); 
 
           // Stay on page, authentication successful
          // Do nothing
 
       } else {
          // User is not signed in, redirect to page with sign in request
          window.location.href = redirectURL;
       }
    } catch (error) {
       // User is registered but user details are missing
       window.location.href = redirectURL;
    }
 }
 
 // insert data
 export async function insertData(tableName, data) {
     try {
         const { data: insertedData, error } = await supabase
             .from(tableName)
             .insert(data)
             .select(); 
 
         if (error) throw error;
         return insertedData;
     } catch (error) {
         console.error("Error inserting data:", error.message);
         return null;
     }
 }
 
 // select data
 async function selectData(tableName, fetchSingle = false, columns = "*", matchColumn = null, matchValue = null) {
     try {
         let query = supabase
             .from(tableName)
             .select(columns);
 
         // Apply filter if matchColumn and matchValue are provided
         if (matchColumn && matchValue !== null) {
             query = query.eq(matchColumn, matchValue);
         }
 
         const { data, error } = fetchSingle ? await query.single() : await query;
 
         if (error) throw error;
         return data;
     } catch (error) {
         console.error("Error fetching data:", error.message);
         return null;
     }
 }
 
 // delete data
 async function deleteRow(tableName, columnName, value) {
     try {
         const { data, error } = await supabase
             .from(tableName)
             .delete()
             .eq(columnName, value)
             .select();
 
         if (error) throw error;
         return data;
     } catch (error) {
         console.error("Error deleting row:", error.message);
         return null;
     }
 }
 
 // update data
 async function updateRow(tableName, matchColumn, matchValue, updateColumn, newValue) {
     try {
         const { data, error } = await supabase
             .from(tableName)
             .update({ [updateColumn]: newValue })
             .eq(matchColumn, matchValue)
             .select();
 
         if (error) throw error;
         return data;
     } catch (error) {
         console.error("Error updating row:", error.message);
         return null;
     }
 }
 


async function submitForm(data) {
  const result = await insertData('admissionstudentdata', data);
  alert("Form submitted successfully. Data inserted: " + JSON.stringify(result));
}


const form = document.getElementById('admissionForm');
    form.addEventListener('submit', (event) => {
      event.preventDefault(); 

      const formData = {
        name: document.getElementById('studentName').value,
        class: document.getElementById('studentClass').value,
        phoneno: document.getElementById('phone').value,
        email: document.getElementById('email').value,
      };

      submitForm(formData);
    });

// retrieve data
async function retrieve() {
  const result = await selectData('admissionstudentdata');
  window.retrievedData = result;
  populateTable();
}

retrieve();
