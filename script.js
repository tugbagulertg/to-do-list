"use strict";

let taskList = [];

//LocalStorage'da taskList durumu null değilse
// taskList üzerine localStorage'dan gelen bilgileri al diyoruz.

if (localStorage.getItem("taskList") !== null) {
  taskList = JSON.parse(localStorage.getItem("taskList"));
}
const addTask = document.querySelector("#addTask");
const taskArea = document.querySelector("#tasks");
const deleteAll = document.querySelector("#deleteAll");
const filters = document.querySelectorAll(".filters span ");

let editId;
let isEditTask = false; //düzenle butonuna bastığımızda true hale getiriyoruz.
displayTask("all");

function displayTask(filter) {
  let ul = document.querySelector("#task-list");
  ul.innerHTML = "";

  if (taskList.length == 0) {
    ul.innerHTML = `<p class="noTask">Listenizde görev bulunmamaktadır.</p>`;
    score.innerHTML = "";
  } else {
    for (let task of taskList) {
      let completed = task.case == "completed" ? "checked" : "";
      let count = 0;
      for (let task of taskList) {
        if (task.case == "completed") {
          count++;
        }
      }
      if (filter == "pending") {
        if (count == taskList.length) {
          ul.innerHTML = `<p class="noTask">Bekleyen görev bulunmamaktadır.</p>`;
        }
      } else if (filter == "completed") {
        if (count == 0) {
          ul.innerHTML = `<p class="noTask">Henüz bir görev tamamlamadınız.</p>`;
        }
      }
      score.innerHTML = `<div class="scoreArea">Tamamlanan: ${count} / ${taskList.length}  </div>`;
      //görev.durum eğer completed ise checked classını da
      // ilgili elemana ekleyerek o görevin tamamlandığını belirtiyorum.
      if (filter == task.case || filter == "all") {
        let li = ` 
        <li class="task ${completed}">
            <div class="task-div"> 
                <button class="bttn-check" onclick="updateTask(this)" id="${task.id}"type="button"><i class="fa-solid fa-check"></i></button>
                <label id="${task.id}" class="task-label ${completed}"> ${task.taskName}</label>
            </div>
            <div class="button-div">
                
                <div class="btn-group">
                    
                    <button type="button" class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis"></i>
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" onclick="deleteTask(${task.id})" href="#">
                            <i class="fa-regular fa-trash-can"></i> Sil</a>
                        </li>
                        <li><a class="dropdown-item" onclick='editTask(${task.id}, "${task.taskName}")' href="#">
                            <i class="fa-regular fa-pen-to-square"></i> Düzenle</a>
                        </li>

                    </ul>
                </div>
            </div>
            

        </li>

    `;
        ul.insertAdjacentHTML("beforeend", li);
      }
    }
  }
}
//  <input type="text" onclick="updateTask(this)" class="task-input" id="${gorev.id}" ${completed} >
// ** Ekle butonuna tıkladığımızda newTask fonksiyonunu çağırıyoruz ya da
// enter'a basıldığında sanki ekle butonuna basılmış gibi tepki vermesini istiyoruz. **/

document.querySelector("#addTask").addEventListener("click", newTask);
document.querySelector("#tasks").addEventListener("keypress", function () {
  if (event.key == "Enter") {
    document.getElementById("addTask").click();
  }
});

//span bölümünde gezerken active renginin ilgili sekmeye tıkladıkça eklenmesini istiyoruz.
for (let span of filters) {
  span.addEventListener("click", function () {
    document.querySelector("span.active").classList.remove("active");
    span.classList.add("active");
    displayTask(span.id);
  });
}

// Yeni görev ekleme ya da görev güncelleme
function newTask(event) {
  if (taskArea.value == "") {
    //herhangi bir görev girilmemişse kullanıcıya uyarı vermek amacıyla
    //  toast bildirimi oluşması için burayı ekliyoruz.
    const toastLiveExample = document.getElementById("liveToast");

    const toast = new bootstrap.Toast(toastLiveExample);

    toast.show();
  } else {
    if (!isEditTask) {
      //ekleme işlemi gerçekleşecekse
      taskList.push({
        id: taskList.length + 1,
        taskName: taskArea.value,
        case: "pending",
      });
      // pending ya da completed kısmında yaptığımız her ekleme işleminden sonra
      // tüm görevleri görebildiğimiz "all" kısmına geçmek istedim.
      document.querySelector("span#completed").classList.remove("active");
      document.querySelector("span#pending").classList.remove("active");
      document.querySelector("span#all").classList.add("active");
    } else {
      //düzenleme işlemi gerçekleşecekse
      for (let task of taskList) {
        if (task.id == editId) {
          task.taskName = taskArea.value;
        }
        isEditTask = false;
      }
    }
    displayTask(document.querySelector("span.active").id);

    taskArea.value = "";
    localStorage.setItem("taskList", JSON.stringify(taskList));
    //taskList'e eklediğimiz elemanın local storage içerisine de eklenmesi için burayı tekrar çağırıyoruz.
  }

  event.preventDefault();
}

//Görev silme
function deleteTask(id) {
  let deleteId;
  for (let index in taskList) {
    if (taskList[index].id == id) {
      deleteId = index;
    }
  }
  taskList.splice(deleteId, 1);
  displayTask(document.querySelector("span.active").id);
  localStorage.setItem("taskList", JSON.stringify(taskList));
}

// görevler üzerinde düzenleme yapma
function editTask(taskId, taskName) {
  editId = taskId;
  isEditTask = true;
  taskArea.value = taskName;
  taskArea.focus(); // düzenle dediğimizde anda input alanı öne çıkıyor.
  taskArea.classList.add("active");
}

// Tüm görevleri temizleme
deleteAll.addEventListener("click", function () {
  taskList.splice(0, taskList.length);
  localStorage.setItem("taskList", JSON.stringify(taskList));
  displayTask();
});

//Tamamlanan görevlerin işaretlenmesi

function updateTask(selectedTask) {
  let label = selectedTask.nextElementSibling;
  let li = label.parentElement.parentElement;
  console.log(li);
  console.log(selectedTask);
  console.log(label);
  let case1;

  //aynı hizada olan diğer elemana bu şekilde ulaşıyoruz.
  //seçilen input'un classında checked varsa ilgili label'a da bu class tanımlanıyor.
  //ayrıca durum bilgisi completed olarak tanımlanıyor.

  if (!label.classList.contains("checked")) {
    label.classList.add("checked");
    li.classList.add("checked");
    case1 = "completed";
  } else {
    label.classList.remove("checked");
    li.classList.remove("checked");
    case1 = "pending";
  }
  for (let task of taskList) {
    if (task.id == selectedTask.id) {
      task.case = case1;
    }
  }

  displayTask(document.querySelector("span.active").id);
  localStorage.setItem("taskList", JSON.stringify(taskList));
}
