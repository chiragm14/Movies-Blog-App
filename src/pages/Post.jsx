import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);
    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) setPost(post);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
        });
    };

    return post ? (
        <div className="py-8">
            <Container>
                <div className="w-full border rounded-xl p-4 my-4 bg-gray-900 relative">
                    {/* Buttons Top Right */}
                    {isAuthor && (
                        <div className="absolute top-4 right-4 flex gap-2 z-10">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-green-500">Edit</Button>
                            </Link>
                            <Button bgColor="bg-red-500" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}

                    {/* Responsive Layout */}
                    <div className="flex flex-col lg:flex-row items-start gap-6 mt-6">
                        {/* Image */}
                        <div className="w-full lg:w-[45%] p-4 pt-6 pb-6">
                            <img
                                src={appwriteService.getFilePreview(post.featuredImage)}
                                alt={post.title}
                                className="w-full max-h-[400px] object-contain rounded-xl"
                            />

                        </div>

                        {/* Title & Description */}
                        
                        <div className="w-full lg:w-[20%] md:w-full px-4 py-4 flex flex-col justify-center">
                            <h1 className="text-4xl font-bold mb-3">{post.title}</h1>
                            <div className="text-xl browser-css text-gray-200">{parse(post.content)}</div>
                        </div>

                    </div>
                </div>
            </Container>
        </div>
    ) : null;
}
