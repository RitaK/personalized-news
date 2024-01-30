import { createContext, useEffect, useState } from 'react';
import { apiUrl } from '../constants/constants';
import { NewsResponse, articleDate } from '../interfaces/apiInterfaces';
import dotenv from 'dotenv';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { experimentalStyled as styled } from '@mui/material/styles';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';



//dotenv.config();

export default function MediaCard({ imgUrl, title, content, onShare, onOpenArticle }: { imgUrl: string, title: string, content: string, onShare(): void, onOpenArticle(): void }) {
    return (
        <Card sx={{ maxWidth: 345, height: '40vh', display: 'flex', flexDirection: 'column' }}>
            <CardMedia sx={{ height: 140 }} image={imgUrl} title={title} />
            <CardContent sx={{ flexGrow: 1, height: '100%' }}>
                <Typography gutterBottom variant="h5" component="div">
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {content}
                </Typography>
            </CardContent>
            <CardActions>
                <Button onClick={onShare} size="small">Share</Button>
                <Button onClick={onOpenArticle} size="small">Learn More</Button>
            </CardActions>
        </Card>
    );
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


export function Feed() {
    //require('dotenv').config();
    const NewsDataContext = createContext<Array<articleDate>>([]);
    const [newsData, setNewsData] = useState<Array<articleDate>>([]);
    const [nextPage, setNextPage] = useState('');
    const [numberOfLoadRes, setNumberOfLoadRes] = useState(1);
    const [country, setCountry] = useState('');
    const [language, setLanguage] = useState('');
    const [searchStr, setSearchStr] = useState('');


    const fetchData = async () => {
        const apiKey = 'pub_3726074d5d61964f4baa6b24b92b9fe046855';//process.env.REACT_APP_NEWS_API_KEY;
        const url = new URL(apiUrl);
        url.searchParams.append('apiKey', apiKey);
        if (nextPage) {
            url.searchParams.append('page', nextPage);
        }
        try {
            const response: NewsResponse = await (await fetch(url))?.json();
            if (response?.results?.length > 0) {
                setNewsData(newsData.concat(response?.results));
                setNextPage(response?.nextPage);
            }
        } catch (error) {
            console.log("An error occurred while fetching the data from the news api")
        }
    }

    const fetchMockData = async () => {
        try {
            //const response = fs.readFileSync('../mockData.json').toJSON();
            //setNewsData(response?.results);
        } catch (error) {
            console.log("An error occurred while fetching the data from the news api")
        }
    }

    const handleScroll = () => {
        const scrollTop: number = document.documentElement.scrollTop;
        const windowHeight: number = window.innerHeight;
        const scrollHeight: number = document.documentElement.scrollHeight;

        if (scrollTop + windowHeight >= scrollHeight - 200) {
            setNumberOfLoadRes(numberOfLoadRes + 1);
        }
    };

    const onShare = (link: string) => {
    }

    const onOpenArticle = (linkUrl: string) => {
        const newWindow = window.open(linkUrl, '_blank', 'noopener,noreferrer');
        if (newWindow) newWindow.opener = null;
    }

    useEffect(() => {
        fetchData();
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
        //fetchMockData();
    }, [numberOfLoadRes]);


    return (
        <NewsDataContext.Provider value={newsData}>

            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {newsData && newsData.map((article) => (
                        <Grid item xs={2} sm={4} md={4} key={article.article_id}>
                            <Item>
                                <MediaCard
                                    content={article.content}
                                    imgUrl={article.image_url}
                                    title={article.title}
                                    onShare={() => { onShare(article.link) }}
                                    onOpenArticle={() => { onOpenArticle(article.link) }} />
                            </Item>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </NewsDataContext.Provider>
    )
}