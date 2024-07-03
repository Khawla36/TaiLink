import React, { Component } from "react";
import axios from "axios";
import "./Service.css";
import { Progress } from 'react-sweet-progress';
import "react-sweet-progress/lib/style.css";

class Service extends Component {
    constructor(props) {
        super(props);
        this.state = {
            servicePage: null,
            contentArray: [],
            loading: false,
            progress: 0,
            error: null,
        };
    }

    componentDidMount() {
        fetch("http://localhost:3001/pages/6", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
        })
            .then((response) => response.json())
            .then((page) => {
                console.log('Fetched page:', page);
                let contentArray = [];
                try {
                    contentArray = Array.isArray(page.content)
                        ? page.content
                        : JSON.parse(page.content);
                } catch (error) {
                    console.error('Error parsing content:', error);
                }
                console.log('Content array:', contentArray);
                this.setState({ servicePage: page, contentArray });
            })
            .catch((error) => this.setState({ error: "Error fetching data" }));
    }

    fetchData = async () => {
        this.setState({
            loading: true,
            progress: 0,
        })

        try {
            const response = await axios.get("http://localhost:3001/trackipetmap", {
                onDownloadProgress: (e) => {
                    const total = e.total;
                    const current = e.loaded;
                    const progress = Math.round((current / total) * 100);
                    this.setState({ progress });
                }
            });

            const { lat, lng } = response.data;
            console.log(response.data);
            const interval = setInterval(() => {
                this.setState((prevState) => {
                    if (prevState.progress >= 100) {
                        clearInterval(interval);
                        setTimeout(() => { window.location.href = `/map?lat=${lat}&lng=${lng}`; }, 1000);
                    }
                    return { progress: prevState.progress + 10 };
                });
            }, 200);

        } catch (error) {
            console.error(error);
            this.setState({ error: "Error fetching location data" });
        } finally {
            this.setState({ loading: false })
        }
    };

    render() {
        const { servicePage, contentArray, loading, progress, error } = this.state;

        if (error) return <div>{error}</div>;
        if (!servicePage) return <div>PAGE NOT FOUND</div>;

        return (
            <div className="container">
                {loading ? (
                    <div>
                        <Progress type="circle" percent={progress} />
                    </div>
                ) : (
                    <div className="content-section">
                        {contentArray.length > 0 ? (
                            <>
                                <p className="Hello">{contentArray[0]?.p || contentArray[0]}</p>
                                <p className="Miss">{contentArray[1]?.p || contentArray[1]}</p>
                            </>
                        ) : (
                            <div>No content available</div>
                        )}

                        <img src="./media/dog1.png" alt="Dog" className="dog-image" />

                        <button className="location" onClick={this.fetchData}>
                            Pet's Location
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

export default Service;
