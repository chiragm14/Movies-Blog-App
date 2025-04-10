import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "../index";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    console.log("userData from Redux:", userData); // ✅ Debugging line

    const submit = async (data) => {
        try {
            if (!userData || !userData.$id) {
                console.error("User is not authenticated or user data not loaded.");
                return; // 🔒 Guard clause
            }

            if (post) {
                const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

                if (file) {
                    await appwriteService.deleteFile(post.featuredImage);
                }

                const dbPost = await appwriteService.updatePost(post.$id, {
                    ...data,
                    featuredImage: file ? file.$id : post.featuredImage,
                });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            } else {
                const file = await appwriteService.uploadFile(data.image[0]);

                if (file && file.$id) {
                    data.featuredImage = file.$id;

                    const dbPost = await appwriteService.createPost({
                        ...data,
                        userId: userData.$id,
                    });

                    if (dbPost) {
                        navigate(`/post/${dbPost.$id}`);
                    }
                } else {
                    console.error("File upload failed or returned invalid response:", file);
                }
            }
        } catch (error) {
            console.error("Submit failed:", error);
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)}>
            <div className="flex flex-col md:flex-row justify-center">
                <div className="w-full md:w-2/3 px-2 flex flex-col items-center">
                    <Input
                        label="Title :"
                        placeholder="Title"
                        className="mb-4 w-full"
                        {...register("title", { required: true })}
                    />
                    <Input
                        label="Slug :"
                        placeholder="Slug"
                        className="mb-4 w-full"
                        {...register("slug", { required: true })}
                        onInput={(e) => {
                            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                        }}
                    />
                    <RTE
                        label="Content :"
                        name="content"
                        control={control}
                        defaultValue={getValues("content")}
                        className="w-full"
                    />
                </div>
                <div className="w-full md:w-1/3 px-2 mt-4 md:mt-0 flex flex-col items-center">
                    <Input
                        label="Featured Image :"
                        type="file"
                        className="mb-4 w-full"
                        accept="image/png, image/jpg, image/jpeg, image/gif"
                        {...register("image", { required: !post })}
                    />
                    {post && (
                        <div className="w-full mb-4 flex justify-center">
                            <img
                                src={appwriteService.getFilePreview(post.featuredImage)}
                                alt={post.title}
                                className="rounded-lg"
                            />
                        </div>
                    )}
                    <Select
                        options={["active", "inactive"]}
                        label="Status:"
                        className="mb-4 w-full"
                        {...register("status", { required: true })}
                    />
                    <Button
                        type="submit"
                        bgColor={post ? "bg-green-500 hover:bg-green-800" : undefined}
                        className="w-full"
                    >
                        {post ? "Update" : "Submit"}
                    </Button>
                </div>
            </div>
        </form>
    );
}
