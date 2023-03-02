function myFunction() {
  const person = document.getElementById("input").value;
  const age = document.getElementById("input2").value;

  if (person !== null) {
    Array.from(document.getElementsByClassName("output")).forEach((el) => {
      el.textContent = person;
    });
  }
  if (age !== null) {
    Array.from(document.getElementsByClassName("output2")).forEach((el) => {
      el.textContent = age;
    });
  }
}