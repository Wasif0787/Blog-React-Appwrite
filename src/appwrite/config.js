import conf from "../conf/conf"
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
    client = new Client();
    databases;
    bucket;
    constructor() {
        this.client
            .setEndpoint(conf.appWriteUrl)
            .setProject(conf.projectID);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({ title, slug, content, featuredImage, staus, userId }) {
        try {
            return await this.databases.createDocument(conf.databaseID, conf.collectionID, slug, {
                title, content, featuredImage, staus, userId
            })
        } catch (error) {
            console.log("Appwrite service error::createPost::error " + error);
        }
    }

    async updatePost(slug, { title, content, featuredImage, staus }) {
        try {
            return await this.databases.updateDocument(conf.databaseID, conf.collectionID, slug,
                { title, content, featuredImage, staus })
        } catch (error) {
            console.log("Appwrite service error::updatePost::error " + error);
        }
    }

    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(conf.databaseID, conf.collectionID, slug)
            return true
        } catch (error) {
            console.log("Appwrite service error::deletePost::error " + error);
            return false
        }
    }

    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                conf.databaseID,
                conf.collectionID,
                slug
            )
        } catch (error) {
            console.log("Appwrite serive :: getPost :: error", error);
            return false
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listDocuments(
                conf.databaseID,
                conf.collectionID,
                queries,
            )
        } catch (error) {
            console.log("Appwrite serive :: getPosts :: error", error);
            return false
        }
    }

    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.bucketID,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite serive :: uploadFile :: error", error);
            return false
        }
    }

    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(
                conf.bucketID,
                fileId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteFile:: error", error);
        }
    }

    getFilePreview(fileID) {
        return this.bucket.getFilePreview(conf.bucketID, fileID)
    }
}

const service = new Service();

export default service;