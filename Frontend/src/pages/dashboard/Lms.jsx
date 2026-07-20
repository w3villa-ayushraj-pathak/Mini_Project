import { useEffect, useState } from "react";
import {Link} from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faGraduationCap, faPlus, faTrash, faSpinner, faVideo, 
  faImage, faArrowRight, faTimes, faBookOpen, faTv,
  faCircleDot, faStar, faClock, faUserGraduate, faChevronLeft
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { 
  getCourses, 
  createCourseDetails, 
  uploadCourseThumbnail, 
  uploadCourseVideo, 
  deleteCourse 
} from "../../services/course.service";

function Lms() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);
  const [createdCourseId, setCreatedCourseId] = useState(null);

  // Form State Configurations
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tutor: { name: "", qualification: "" },
    courseAccess: "free",
    duration: "",
    courseType: "computer",
    rating: { average: 4.5, count: 1 }
  });

  const [files, setFiles] = useState({ thumbnail: null, video: null });
  const [previews, setPreviews] = useState({ thumbnail: "", video: "" });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await getCourses();
      setCourses(res.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to catalog course indexes");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("tutor.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({ ...prev, tutor: { ...prev.tutor, [field]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    const file = selectedFiles[0];
    if (!file) return;

    setFiles(prev => ({ ...prev, [name]: file }));
    setPreviews(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
  };

  const executeStageOneDetails = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const res = await createCourseDetails(formData);
      setCreatedCourseId(res.data.course._id);
      toast.success("Details committed. Proceeding to assets upload pipeline.");
      setModalStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification criteria rejected course parameter rows");
    } finally {
      setActionLoading(false);
    }
  };

  const executeStageTwoAssets = async () => {
    if (!files.thumbnail || !files.video) {
      return toast.error("Both binary file parameters (Thumbnail & Video) are explicitly required.");
    }

    try {
      setActionLoading(true);
      
      toast.loading("Uploading course thumbnail to cloud node...", { id: "upload" });
      await uploadCourseThumbnail(createdCourseId, files.thumbnail);
      
      toast.loading("Synchronizing stream video asset container payload...", { id: "upload" });
      await uploadCourseVideo(createdCourseId, files.video);
      
      toast.success("Course node built completely into global cluster mapping", { id: "upload" });
      closeModalHandler();
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Cloud node transmission error occurred", { id: "upload" });
    } finally {
      setActionLoading(false);
    }
  };

  const executeDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to purge this course object allocation from cluster files?")) return;
    try {
      const res = await deleteCourse(courseId);
      toast.success(res.message || "Course node deleted safely.");
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to drop target course object layout");
    }
  };

  const closeModalHandler = () => {
    setShowModal(false);
    setModalStep(1);
    setCreatedCourseId(null);
    setFormData({
      name: "", description: "", tutor: { name: "", qualification: "" },
      courseAccess: "free", duration: "", courseType: "computer", rating: { average: 4.5, count: 1 }
    });
    setFiles({ thumbnail: null, video: null });
    setPreviews({ thumbnail: "", video: "" });
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-zinc-100 font-sans selection:bg-emerald-500/30 relative flex flex-col overflow-x-hidden">
      <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <Navbar />

      <div className="flex flex-col md:flex-row flex-1 relative z-10 max-w-7xl w-full mx-auto">

        <main className="flex-1 p-6 sm:p-8 md:p-10 flex flex-col gap-y-8 overflow-hidden">
          

            <Link 
              to="/admin/dashboard"
              className="inline-flex items-center gap-x-2 text-zinc-500 hover:text-emerald-400 text-xs font-bold tracking-wider uppercase mb-4 transition-colors"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
              <span>Back to Dashboard</span>
            </Link>  


          <header className="border-b border-zinc-900 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            
            <div className="flex items-center gap-x-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-inner">
                <FontAwesomeIcon icon={faBookOpen} className="text-sm" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                  LMS Curriculums
                </h1>
                <p className="text-zinc-500 text-xs sm:text-sm mt-0.5 font-medium tracking-wide">
                  Deploy learning sandboxes, manage digital streaming payloads, and handle protection vectors.
                </p>
              </div>
            </div>

            <button 
              onClick={() => setShowModal(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/10 active:scale-95 transition-all flex items-center gap-x-2 cursor-pointer self-start sm:self-center"
            >
              <FontAwesomeIcon icon={faPlus} className="text-xs" />
              <span>Instantiate Course Node</span>
            </button>
          </header>

          <section className="flex-1 min-h-[400px] relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-10 w-10 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-zinc-800 rounded-full" />
                  <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
            ) : courses.length === 0 ? (
              <div className="w-full text-center py-20 border border-dashed border-zinc-850 bg-zinc-900/10 rounded-3xl">
                <p className="text-zinc-500 text-sm font-medium">No active course modules found mapped to cluster data stores.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course._id} className="group bg-zinc-950/40 backdrop-blur-md border border-zinc-800/80 hover:border-zinc-700/60 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between transition-all duration-200">
                    <div>
                      <div className="relative aspect-video w-full bg-zinc-900 border-b border-zinc-900 flex items-center justify-center overflow-hidden">
                        {course.thumbnail?.url ? (
                          <img src={course.thumbnail.url} alt={course.name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" />
                        ) : (
                          <FontAwesomeIcon icon={faTv} className="text-zinc-700 text-3xl" />
                        )}
                        <span className={`absolute top-3 right-3 text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded shadow ${
                          course.courseAccess === "free" ? "bg-blue-500/20 text-blue-400 border border-blue-500/10" : "bg-amber-500/20 text-amber-400 border border-amber-500/10"
                        }`}>
                          {course.courseAccess}
                        </span>
                      </div>

                      <div className="p-5 flex flex-col gap-y-2">
                        <div className="flex items-center gap-x-2 text-[10px] uppercase font-bold text-emerald-400">
                          <FontAwesomeIcon icon={faCircleDot} className="text-[7px]" />
                          <span>{course.courseType}</span>
                        </div>
                        <h3 className="text-white font-bold text-base sm:text-lg tracking-tight truncate capitalize group-hover:text-emerald-300 transition-colors">
                          {course.name}
                        </h3>
                        <p className="text-zinc-500 text-xs line-clamp-2 font-medium leading-relaxed">
                          {course.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-3 border-t border-zinc-900/60 bg-zinc-900/10 flex items-center justify-between text-xs font-medium text-zinc-400">
                      <div className="flex items-center gap-x-3">
                        <span className="flex items-center gap-x-1"><FontAwesomeIcon icon={faClock} className="text-[11px] text-zinc-600" /> {course.duration}</span>
                        <span className="flex items-center gap-x-1 text-amber-400/90"><FontAwesomeIcon icon={faStar} className="text-[10px]" /> {course.rating?.average || 0}</span>
                      </div>
                      <button 
                        onClick={() => executeDelete(course._id)}
                        className="h-8 w-8 rounded-lg bg-zinc-900 hover:bg-rose-500/10 border border-zinc-800 hover:border-rose-500/20 text-zinc-500 hover:text-rose-400 transition-colors flex items-center justify-center cursor-pointer shadow-inner"
                        title="Purge Course Node"
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-xs" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </section>

          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
              <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
                
                <div className="p-5 border-b border-zinc-900 flex items-center justify-between bg-zinc-900/20">
                  <div>
                    <h3 className="text-white font-bold text-lg tracking-tight">Create Course Pipeline</h3>
                    <p className="text-zinc-500 text-xs mt-0.5">Stage {modalStep} / 2 — {modalStep === 1 ? "Configure Metadata Core" : "Accept Assets Payload"}</p>
                  </div>
                  <button onClick={closeModalHandler} className="text-zinc-500 hover:text-white transition-colors cursor-pointer p-1"><FontAwesomeIcon icon={faTimes} /></button>
                </div>

                <div className="p-6 overflow-y-auto space-y-5 flex-1">
                  
                  {modalStep === 1 ? (
                    <form id="details-form" onSubmit={executeStageOneDetails} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-y-1.5">
                          <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider pl-1">Course Identity Name</label>
                          <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. advanced data architecture" required className="w-full outline-none bg-zinc-900 border border-zinc-800 text-white px-4 py-2.5 rounded-xl text-sm focus:border-emerald-500" />
                        </div>
                        <div className="flex flex-col gap-y-1.5">
                          <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider pl-1">Validity Duration</label>
                          <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} placeholder="e.g. 12 hours" required className="w-full outline-none bg-zinc-900 border border-zinc-800 text-white px-4 py-2.5 rounded-xl text-sm focus:border-emerald-500" />
                        </div>
                      </div>

                      <div className="flex flex-col gap-y-1.5">
                        <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider pl-1">Course Target Blueprint Description</label>
                        <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Write granular scope details down..." required rows={3} className="w-full outline-none bg-zinc-900 border border-zinc-800 text-white px-4 py-2.5 rounded-xl text-sm focus:border-emerald-500 resize-none" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-y-1.5">
                          <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider pl-1">Instructor Full Name</label>
                          <input type="text" name="tutor.name" value={formData.tutor.name} onChange={handleInputChange} placeholder="e.g. dr. alan turing" required className="w-full outline-none bg-zinc-900 border border-zinc-800 text-white px-4 py-2.5 rounded-xl text-sm focus:border-emerald-500" />
                        </div>
                        <div className="flex flex-col gap-y-1.5">
                          <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider pl-1">Academic Qualification</label>
                          <input type="text" name="tutor.qualification" value={formData.tutor.qualification} onChange={handleInputChange} placeholder="e.g. Ph.D. in AI Systems" className="w-full outline-none bg-zinc-900 border border-zinc-800 text-white px-4 py-2.5 rounded-xl text-sm focus:border-emerald-500" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-y-1.5">
                          <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider pl-1">Access Encrypt Rules</label>
                          <select name="courseAccess" value={formData.courseAccess} onChange={handleInputChange} className="w-full outline-none bg-zinc-900 border border-zinc-800 text-zinc-200 px-4 py-2.5 rounded-xl text-sm focus:border-emerald-500 cursor-pointer">
                            <option value="free">FREE Access Allocation</option>
                            <option value="paid">PAID Subscription Shielded</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-y-1.5">
                          <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider pl-1">Curriculum Discipline</label>
                          <select name="courseType" value={formData.courseType} onChange={handleInputChange} className="w-full outline-none bg-zinc-900 border border-zinc-800 text-zinc-200 px-4 py-2.5 rounded-xl text-sm focus:border-emerald-500 cursor-pointer">
                            {['science', 'arts', 'commerce', 'computer', 'artificial intelligence', 'machine learning'].map(t => (
                              <option key={t} value={t} className="capitalize">{t}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-5 animate-in slide-in-from-right-4 duration-200">
                      
                      <div className="flex flex-col gap-y-2">
                        <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider pl-1">Asset Module Thumbnail (Image File)</label>
                        <div className="border border-zinc-800 bg-zinc-900/40 p-4 rounded-xl flex items-center gap-4">
                          <label htmlFor="thumbnail" className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-zinc-300 text-xs font-bold cursor-pointer flex items-center gap-x-2 shrink-0">
                            <FontAwesomeIcon icon={faImage} /> Select Graphic
                          </label>
                          <input type="file" id="thumbnail" name="thumbnail" accept="image/*" onChange={handleFileChange} className="hidden" />
                          <span className="text-zinc-500 text-xs truncate">{files.thumbnail ? files.thumbnail.name : "No binary input verified"}</span>
                        </div>
                        {previews.thumbnail && (
                          <div className="mt-1 aspect-video w-36 border border-zinc-850 rounded-lg overflow-hidden"><img src={previews.thumbnail} alt="preview" className="w-full h-full object-cover" /></div>
                        )}
                      </div>

                      <div className="flex flex-col gap-y-2 pt-2 border-t border-zinc-900">
                        <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider pl-1">Course Core Content (Video Binary)</label>
                        <div className="border border-zinc-800 bg-zinc-900/40 p-4 rounded-xl flex items-center gap-4">
                          <label htmlFor="video" className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-zinc-300 text-xs font-bold cursor-pointer flex items-center gap-x-2 shrink-0">
                            <FontAwesomeIcon icon={faVideo} /> Target Video
                          </label>
                          <input type="file" id="video" name="video" accept="video/*" onChange={handleFileChange} className="hidden" />
                          <span className="text-zinc-500 text-xs truncate">{files.video ? files.video.name : "No streaming payload verified"}</span>
                        </div>
                        {previews.video && (
                          <div className="mt-1 text-xs font-bold font-mono text-emerald-400/80 bg-emerald-500/5 border border-emerald-500/10 rounded-lg px-3 py-1.5 w-max">
                            ✓ Streaming configuration parameters mapped properly
                          </div>
                        )}
                      </div>

                    </div>
                  )}
                </div>

                <div className="p-5 border-t border-zinc-900 bg-zinc-900/20 flex items-center justify-end gap-x-3">
                  <button type="button" onClick={closeModalHandler} disabled={actionLoading} className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs sm:text-sm transition-colors cursor-pointer active:scale-95 disabled:opacity-40">Cancel</button>
                  
                  {modalStep === 1 ? (
                    <button type="submit" form="details-form" disabled={actionLoading} className="px-5 py-2 rounded-xl bg-emerald-500 text-zinc-950 hover:bg-emerald-400 text-xs sm:text-sm font-bold transition-all shadow-lg active:scale-95 cursor-pointer flex items-center gap-x-2 disabled:opacity-50">
                      {actionLoading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <><span>Next Track</span><FontAwesomeIcon icon={faArrowRight} className="text-xs" /></>}
                    </button>
                  ) : (
                    <button type="button" onClick={executeStageTwoAssets} disabled={actionLoading} className="px-5 py-2 rounded-xl bg-emerald-500 text-zinc-950 hover:bg-emerald-400 text-xs sm:text-sm font-bold transition-all shadow-lg active:scale-95 cursor-pointer flex items-center gap-x-2 disabled:opacity-50">
                      {actionLoading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <><span>Create Module</span><FontAwesomeIcon icon={faUserGraduate} className="text-xs" /></>}
                    </button>
                  )}
                </div>

              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default Lms;