import axios from 'axios';

const getAccessToken = async () => {
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', process.env.SPOTIFY_REFRESH_TOKEN);

    const encodedAuthorizationValue = toBase64(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    );

    const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        params.toString(),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${encodedAuthorizationValue}`,
            },
        }
    );

    return response.data.access_token as string;
};

export const getCurrentlyPlayingTrack = async () => {
    const accessToken = await getAccessToken();

    const response = await axios.get(
        'https://api.spotify.com/v1/me/player/currently-playing',
        { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (response.status === 204 || !response.data) {
        return null;
    }

    const {
        data: { item },
    } = response;

    const name = item.name;
    const artist = item.artists.map((x) => x.name).join(', ');

    const albumImageUrl = item.album.images.find(
        (x) => x.width === 300 && x.height === 300
    )?.url;

    const albumImage =
        albumImageUrl &&
        (await axios
            .get(albumImageUrl, {
                responseType: 'arraybuffer',
            })
            .then((response) => toBase64(response.data)));

    const track = {
        name,
        artist,
        albumImage,
    };

    return track;
};

const toBase64 = (data) => Buffer.from(data).toString('base64');
