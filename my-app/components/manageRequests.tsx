import React, { useEffect, useState } from 'react';
import PriceInput from './priceInput';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import handleTokenExpiration from '@/lib/handleTokenExpiration';
interface Request {
    _id: string;
    amount: number;
    description: string;
    Date: string;
    status: 'pending' | 'approved' | 'rejected';
    user: string;
}


interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute  inset-0 w-11/12 mt-10 mx-auto z-50 lg:w-full max-w-md"
                    >
                        <div className=" rounded-lg shadow-xl ">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export const ManageRequests = () => {
    const [requests, setRequests] = useState<Request[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
    const [editForm, setEditForm] = useState({
        amount: '',
        description: '',
        status: '',
    });
    const [userData, setUserData] = useState<{ name: string,role:string }  >({ name: '',role:'' });
    useEffect(() => {
      const fetchUserData = async () => {
        if (localStorage.getItem("token") === null) {
          window.location.href = "/login";
        }
        try {
          const response = await fetch("/api/auth", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const data = await response.json();
  
          setUserData(data.users);
          if (response.status === 401|| localStorage.getItem("token") === null) {
            
            const error = new Error("Token is expired");
            handleTokenExpiration(error);
          }
  
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
  
      fetchUserData();
    }, []);
    useEffect(() => {
        fetchRequests();
    }, []);
    const statusOptions = [
        { value: 'pending', label: 'در انتظار', color: 'bg-yellow-500/20 text-yellow-500' },
        { value: 'approved', label: 'تایید شده', color: 'bg-green-500/20 text-green-500' },
        { value: 'rejected', label: 'رد شده', color: 'bg-red-500/20 text-red-500' }
    ];

    const fetchRequests = async () => {
        try {
            const response = await fetch('/api/request', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();
            setRequests(data.requests);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    const handleEdit = (request: Request) => {
        setSelectedRequest(request);
        setEditForm({
            amount: request.amount.toString(),
            description: request.description,
            status: request.status,
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async () => {
        if (!selectedRequest) return;
        console.log(editForm);

        try {
            const response = await fetch('/api/request', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    id: selectedRequest._id,
                    amount: Number(editForm.amount),
                    description: editForm.description,
                    status: editForm.status, // Add this line
                    Date: selectedRequest.Date,
                }),
            });

            if (response.ok) {
                setIsEditModalOpen(false);
                fetchRequests();
                toast.success('درخواست با موفقیت بروزرسانی شد', {
                    style: {
                        direction: 'rtl',
                        backgroundColor: '#10B981',
                        color: 'white'
                    }
                });
            } else {
                toast.error('درخواست بروزرسانی ناموفق بود', {
                    style: {
                        direction: 'rtl',
                        backgroundColor: '#EF4444',
                        color: 'white'
                    }
                });
            }
        } catch (error) {
            console.error('Error updating request:', error);
        }
    };

    if (requests.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">هیچ درخواستی وجود ندارد</h1>
                    <p className="text-gray-500">شما هیچ درخواستی ندارید</p>
                </div>
            </div>
        );
    }
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="  "
        >
            <Toaster />
            <h2 className="text-2xl w-fit mx-auto px-4 py-3  rounded-md mt-3 font-bold mb-6 border-4 border-sky-600">مدیریت درخواست‌ها</h2>

            <div className=" flex flex-wrap gap-3 w-full p-1">
                {requests.map((request) => (
                    <motion.div
                        key={request._id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white/10 w-full backdrop-blur-sm p-4 rounded-lg border "
                    >
                        <div className="flex  justify-between items-start mb-3">
                            <span className="text-lg font-semibold">
                                {new Intl.NumberFormat('fa-IR').format(request.amount)} تومان
                            </span>
                            <span className="px-2 py-1 rounded-full text-sm bg-blue-600 text-white">
                                {request.status === 'pending' ? 'در انتظار' : request.status === 'approved' ? 'تایید شده' : 'رد شده'}
                            </span>
                        </div>
                        <p className="text-gray-700 mb-4">{request.description}</p>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                                {new Date(request.Date).toLocaleDateString('fa-IR')}
                            </span>
                           {userData.role=='manager' &&<button
                                onClick={() => handleEdit(request)}
                                className="px-4 py-2 border-2 border-blue-600 h text-lg rounded-lg hover:text-white hover:bg-blue-700 transition"
                            >
                                ویرایش
                            </button>}
                        </div>
                    </motion.div>
                ))}
            </div>

            {isEditModalOpen && (
                <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                    <div className="p-6 bg-white/70 rounded-lg">
                        <h3 className="text-xl font-bold mb-5 text-center">ویرایش درخواست</h3>
                        <div className="space-y-4">
                            <PriceInput
                                name="amount"
                                value={editForm.amount}
                                onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                            />
                            <div className="flex justify-between items-start mb-3">

                                <select
                                    value={editForm.status}
                                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                    className=" rounded-lg w-full px-1 py-4 bg-white backdrop-blur-sm border text-sm"
                                >
                                    {statusOptions.map((option) => (
                                        <option key={option.value} value={option.value} className="bg-gray-800">
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <textarea
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                className="w-full p-2 rounded-lg bg-white backdrop-blur-sm border"
                                rows={4}
                                placeholder="توضیحات"
                            />
                            <div className="flex justify-between gap-2">
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 transition"
                                >
                                    انصراف
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition"
                                >
                                    ذخیره تغییرات
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </motion.div>
    );
};
