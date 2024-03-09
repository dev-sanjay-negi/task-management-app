
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Button, Modal, Offcanvas } from 'react-bootstrap';
import * as Yup from 'yup';

const taskSchema = Yup.object({
    task_title: Yup.string().required('Enter the task title'),
    task_desc: Yup.string().required('Enter the task description'),
    task_duedate: Yup.date().required('Enter the due date'),
    task_assgined_to: Yup.string().required('Enter the name of task owner'),
    task_priority: Yup.string().required('Select the priority of task'),
    task_tags: Yup.string().required('Enter the tags associated with this task'),
    task_status: Yup.string().required('Select the task status')
});

const initialValues = {
    task_title: '',
    task_desc: '',
    task_duedate: '',
    task_priority: '',
    task_assgined_to: '',   
    task_tags: '',
    task_status: '',
    created_at: '',
    updated_at: ''
}

const URL = 'https://task-db.glitch.me/data';


const TaskForm = () => {
    const [modalShow, setModalShow] = useState(false);
    const [data, setData] = useState([]);
    const [updatingTask, setCurrentTask] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [details, setDetails] = useState('');
    const [show, setShow] = useState(false);

    // Get Task
    const fetchData = async () => {
        await axios.get(URL).then((res) => {
            setData(res.data);
        }).catch((error) => toast.error(error.message));
    }

    // Add Task
    const postData = async () => {
        formik.values.created_at = new Date().toISOString();
        await axios.post(URL, formik.values).then(() => {
            toast.success("Task created successfully");
            formik.resetForm();
            fetchData();
        }).catch((error) => {
            toast.error(error.message);
        });
    }

    // Delete Task
    const deleteData = async (id) => {
        await axios.delete(`${URL}/${id}`).then(() => {
            toast.success("Task deleted successfully")
            fetchData();
        }).catch((error) => toast.error(error.message));
    }

    // Get data for Update
    const fetchDataForUpdate = async (id) => {
        await axios.get(`${URL}/${id}`).then((res) => {
            const task = res.data;
            formik.setValues(task);
            setModalShow(true);
            setCurrentTask(id);
        }).catch((error) => toast.error(error.message));
    }

    // Update Data
    const updateData = async (id, values) => {
        formik.values.updated_at = new Date().toISOString();
        await axios.put(`${URL}/${id}`, values).then((res) => {
            toast.success("Task updated successfully");
            formik.resetForm();
            setModalShow(false);
            fetchData();
        }).catch((error) => toast.error(error.message));
    }

    // Task Button Behaviour
    const AddTaskClick = () => {
        formik.resetForm();
        setModalShow(true);
    }


    // Filter Logic

    const filterTasks = (tasks) => {
        let filteredTasks = tasks;
        if (statusFilter) {
            filteredTasks = filteredTasks.filter(task => task.task_status === statusFilter);
        }
        if (priorityFilter) {
            filteredTasks = filteredTasks.filter(task => task.task_priority === priorityFilter);
        }
        if (searchQuery) {
            filteredTasks = filteredTasks.filter(task =>
                task.task_title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return filteredTasks;
    }


    // Seperate Tags
    const mapTags = (tagsString) => {
        const tagsArray = tagsString.split(',').map(tag => tag.trim());
        return tagsArray.map((el, i) => <li key={i}>{el}</li>);
    }


    // Normalize Date 
    const normalizeDate = (date) => {
        const nDate = new Date(date).toString();
        return nDate;
    }

    // Show All Details

    const showTaskDetails = async (id) => {
        setShow(true);
        await axios.get(`${URL}/${id}`).then((res) => {
            setDetails(res.data);
        }).catch((error) => toast.error(error.message));
    }

    // OffCanvas Container

    const handleOffCanvas = () => setShow(false);





    // useEffect

    useEffect(() => {
        fetchData();
    }, []);


    // Formik Form
    const formik = useFormik({
        initialValues,
        validationSchema: taskSchema,
        onSubmit: (values, action) => {
            if (updatingTask) {
                updateData(updatingTask, values);
            } else {
                postData(values);
            }
            setModalShow(false);
            action.resetForm();
            fetchData();
        }
    });


    return (
        <>

            {/* Toast container */}
            <ToastContainer
                position="top-right"
                hideProgressBar
                newestOnTop={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme="colored"
            />

            {/* Modal form */}
            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {updatingTask ? 'Edit Task' : 'Add Task'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <form onSubmit={formik.handleSubmit}>
                        <div className='form-group mb-3'>
                            <label className='mb-1'>Title</label>
                            <input name="task_title" type='text' className='form-control' placeholder='Enter the task title' value={formik.values.task_title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            ></input>
                            {formik.errors.task_title && formik.touched.task_title ? <p className="form-error">{formik.errors.task_title}</p> : null}
                        </div>

                        <div className='form-group mb-3'>
                            <label className='mb-1'>Description</label>
                            <textarea name="task_desc" className='form-control' rows='3' placeholder='Enter the additional details or notes about the task' value={formik.values.task_desc}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}></textarea>
                            {formik.errors.task_desc && formik.touched.task_desc ? <p className="form-error">{formik.errors.task_desc}</p> : null}
                        </div>
                        <div className='form-group mb-3'>
                            <label className='mb-1'>Due date</label>
                            <input name="task_duedate" type='date' className='form-control' placeholder='Due Date'
                                value={formik.values.task_duedate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}></input>
                            {formik.errors.task_duedate && formik.touched.task_duedate ? <p className="form-error">{formik.errors.task_duedate}</p> : null}
                        </div>
                        <div className='form-group mb-3'>
                            <label className='mb-1' >Priority</label>
                            <select name="task_priority" className='form-control' value={formik.values.task_priority} onChange={formik.handleChange}
                                onBlur={formik.handleBlur}>
                                <option>---- Select the task priority ----</option>
                                <option value='high'>High</option>
                                <option value='medium'>Medium</option>
                                <option value='low'>Low</option>
                            </select>
                            {formik.errors.task_priority && formik.touched.task_priority ? <p className="form-error">{formik.errors.task_priority}</p> : null}
                        </div>
                        <div className='form-group mb-3'>
                            <label className='mb-1'>Tags</label>
                            <input name="task_tags" type='text' className='form-control' placeholder='Enter the tags (comma seperated labels or keywords to help organize and classify 
tasks)' value={formik.values.task_tags} onChange={formik.handleChange}
                                onBlur={formik.handleBlur}></input>
                            {formik.errors.task_tags && formik.touched.task_tags ? <p className="form-error">{formik.errors.task_tags}</p> : null}
                        </div>
                        <div className='form-group mb-3'>
                            <label className='mb-1' >Status</label>
                            <select name="task_status" className='form-control' value={formik.values.task_status} onChange={formik.handleChange}
                                onBlur={formik.handleBlur}>
                                <option>---- Select the task status ----</option>
                                <option value='inprocess'>In progress</option>
                                <option value='pending'>Pending</option>
                                <option value='completed'>Completed</option>
                            </select>
                            {formik.errors.task_status && formik.touched.task_status ? <p className="form-error">{formik.errors.task_status}</p> : null}
                        </div>

                        <div className='form-group mb-3'>
                            <label className='mb-1'>Task owner</label>
                            <input name="task_assgined_to" type='text' className='form-control' placeholder='Enter the task owner name' value={formik.values.task_assgined_to}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            ></input>
                            {formik.errors.task_assgined_to && formik.touched.task_assgined_to ? <p className="form-error">{formik.errors.task_assgined_to}</p> : null}
                        </div>

                        <div className='form-group mb-3'>
                            <button type="button" onClick={formik.handleSubmit} className='input-button btn btn-primary' >Add Task</button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

            <section className='wrapper py-5'>
                <div className='container'>
                    <div className='row d-flex justify-space-between mb-5'>
                        <div className='col-12'>
                            <div className='row d-flex justify-space-between mb-5'>
                                <div className='appTitle col-6'>
                                    <h3>Task App</h3>
                                </div>

                                {/* Add Task */}
                                <div className='col-6 text-end'>
                                    <Button variant="primary" onClick={AddTaskClick}><i className="fa-solid fa-plus"></i> Add Task</Button>
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className='col-12 '>
                            <div className='row d-flex justify-space-between'>
                                <div className='col-12 mb-3 col-lg-6  col-md-4 col-sm-12'>
                                    <input type='search' placeholder='Enter the keyword' className='form-control'
                                        onKeyDown={(e) => setSearchQuery(e.target.value)}
                                    ></input>

                                </div>
                                <div className='col-12 mb-3 col-lg-3  col-md-4 col-sm-12'>
                                    <select name="task_status" className="form-control" onChange={(e) => setStatusFilter(e.target.value)}>
                                        <option value=''>Status</option>
                                        <option value="inprocess">In progress</option>
                                        <option value="pending">Pending</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                <div className='col-12 mb-3 col-lg-3  col-md-4 col-sm-12'>
                                    <select name="task_priority" className="form-control" onChange={(e) => setPriorityFilter(e.target.value)}>
                                        <option value=''>Priority</option>
                                        <option value="high">High</option>
                                        <option value="medium">Medium</option>
                                        <option value="low">Low</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Task Listing */}
                    <div className='appList col-12'>
                        <div className='row'>

                            {filterTasks(data).map((task) => (
                                <div className='cardOuter col-lg-4 col-md-6 col-sm-12' key={task.id}>
                                    <div className="card">
                                        <div className="cardInr">
                                            <div className="tasktopMeta">
                                                <div className='d-flex  flex-wrap justify-space-between w-100'>
                                                    <div className='col-6 priority'>
                                                        <i className={task.task_priority === 'high' ? 'fa fa-circle text-danger' : task.task_priority === 'medium' ? 'fa fa-circle text-warning' : 'fa fa-circle text-success'} />
                                                        {task.task_priority}
                                                    </div>
                                                    <div className='col-6 status text-end'>

                                                        <span className={task.task_status === 'inprocess' ? 'badge bg-warning text-dark' : task.task_status === 'pending' ? 'badge bg-danger' : 'badge bg-success'}>{task.task_status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="taskTitle">
                                                <h3>{task.task_title}</h3>
                                            </div>
                                            <div className="taskDesc">
                                                <p>{task.task_desc}</p>
                                            </div>
                                            <div className="taskTags">
                                                {mapTags(task.task_tags)}
                                            </div>
                                            <div className="taskOwner">
                                                <i className="fa-regular fa-user"></i>
                                                {task.task_assgined_to}
                                            </div>
                                            <div className="taskMeta">
                                                <div className='allDetails text-primary' onClick={() => { showTaskDetails(task.id) }}>Check full details</div>
                                                <div className="taskActions">
                                                    <ul>
                                                        <li onClick={() => fetchDataForUpdate(task.id)}>
                                                            <i className="fa-regular fa-pen-to-square"></i>
                                                        </li>
                                                        <li onClick={() => deleteData(task.id)}>
                                                            <i className="fa-regular fa-trash-can"></i>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>


            {/* All Details OffCanvas */}

            {show &&
                <Offcanvas show={show} onHide={handleOffCanvas}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Task Details</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <h2>{details.task_title}</h2>
                        <hr />
                        <h6>Description</h6>
                        <p>{details.task_desc}</p>
                        <hr />
                        <h6>Tags associated with</h6>
                        <div className="taskTags">
                            {details.task_tags}
                        </div>
                        <hr />
                        <h6>Priority</h6>
                        <p className='iconmar'>
                            <i className={details.task_priority === 'high' ? 'fa fa-circle text-danger' : details.task_priority === 'medium' ? 'fa fa-circle text-warning' : 'fa fa-circle text-success'} />
                            {details.task_priority}
                        </p>
                        <hr />
                        <h6>Status</h6>
                        <p>
                            <span className={details.task_status === 'inprocess' ? 'badge bg-warning text-dark' : details.task_status === 'pending' ? 'badge bg-danger' : 'badge bg-success'}>{details.task_status}</span>
                        </p>
                        <hr />
                        <h6>Assigned To</h6>
                        <p>{details.task_assgined_to}</p>
                        <hr />
                        <h6>Due date</h6>
                        <p>{details.task_duedate}</p>
                        <hr />
                        <h6>Created at</h6>
                        <p>{normalizeDate(details.created_at)}</p>
                        <hr />
                        <h6>Last updated at</h6>
                        <p>{normalizeDate(details.updated_at)}</p>
                     
                    </Offcanvas.Body>
                </Offcanvas>
            }
        </>
    );

}
export default TaskForm