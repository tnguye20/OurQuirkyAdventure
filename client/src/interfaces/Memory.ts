import firebase from 'firebase';
import { IUser } from './User';

export enum Category {
    image = 'image',
    video = 'video'
};

export enum Extension {
    JPEG = 'jpeg',
    JPG = 'jpg',
    PNG = 'png',
    GIF = 'gif',
    MP4 = 'mp4'
};

export enum Mimetype {
  JPEG = 'image/jpeg',
  JPG = 'image/jpg',
  PNG = 'image/png',
  GIF = 'image/gif',
  QUICKTIME = 'video/quicktime',
  MP4 = 'video/mp4',
}

export interface IMemory {
    city?: string | null,
    country?: string | null,
    countryCode?: string | null,
    formattedAddress?: string | null,
    neighbourhood?: string | null,
    streetName?: string | null,
    streetNumber?: string | null,
    zipcode?: string | null,
    provider?: string | null,
    state?: string | null,
    latitude?: string | null,
    longitude?: string | null,
    id?: string | null,
    name: string,
    size: number,
    user: IUser['id'],
    title: string,
    category: keyof typeof Category,
    extension: keyof typeof Extension,
    mimetype: keyof typeof Mimetype,
    takenDate: firebase.firestore.Timestamp,
    takenMonth?: string | null,
    takenYear?: string | null,
    uploadedDate: firebase.firestore.Timestamp,
    tags?: Array<string>,
    url?: string,
}

export class Memory implements IMemory {
    city: string | null = null;
    country: string | null = null;
    countryCode: string | null = null;
    formattedAddress: string | null = null;
    neighbourhood: string | null = null;
    streetName: string | null = null;
    streetNumber: string | null = null;
    zipcode: string | null = null;
    provider: string | null = null;
    state: string | null = null;
    latitude: string | null = null;
    longitude: string | null = null;
    id: string | null = null;
    name: string;
    title: string = 'One of my best memories with you';
    size: number;
    user: string;
    category: keyof typeof Category;
    extension: keyof typeof Extension;
    mimetype: keyof typeof Mimetype;
    takenDate: firebase.firestore.Timestamp = firebase.firestore.Timestamp.now();
    uploadedDate: firebase.firestore.Timestamp = firebase.firestore.Timestamp.now();
    tags: string[] = [];
    takenMonth = null;
    takenYear = null;
    url: string = '';

    constructor(
        name: string,
        size: number,
        user: string,
        category: keyof typeof Category,
        extension: keyof typeof Extension,
        mimetype: keyof typeof Mimetype,
        title?: string,
        tags?: string[],
        id?: string,
        url?: string,
    ) {
        this.name = name;
        this.size = size;
        this.user = user;
        this.category = category;
        this.extension = extension;
        this.mimetype = mimetype;
        if (title) this.title = title;
        if (tags) this.tags = tags;
        if (id) this.id = id;
        if (url) this.url = url;
    }
}