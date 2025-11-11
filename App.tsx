
import React, { useState, useEffect, useCallback } from 'react';
import { HTTPMethod, RequestData, ResponseData, KeyValuePair, HistoryItem, KeyFilePair } from './types';
import { HTTP_METHODS, SAMPLE_PAYLOADS } from './constants';

// --- SVG Icon Components ---

const PlusCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
);

const Trash2Icon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
);

const HistoryIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M12 8v4l4 2"></path></svg>
);

// --- Helper Functions ---

const generateUniqueId = (): string => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const formatJson = (jsonString: string): string => {
    try {
        const parsed = JSON.parse(jsonString);
        return JSON.stringify(parsed, null, 2);
    } catch (e) {
        return jsonString;
    }
};

// --- Child Components ---

interface KeyValueEditorProps {
    title: string;
    items: KeyValuePair[];
    setItems: React.Dispatch<React.SetStateAction<KeyValuePair[]>>;
}

const KeyValueEditor: React.FC<KeyValueEditorProps> = ({ title, items, setItems }) => {
    const handleItemChange = (id: string, field: 'key' | 'value', value: string) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const addItem = () => {
        setItems(prev => [...prev, { id: generateUniqueId(), key: '', value: '' }]);
    };

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-300">{title}</h3>
                <button onClick={addItem} className="p-1 text-gray-400 hover:text-hacker-accent transition-colors">
                    <PlusCircleIcon className="w-5 h-5" />
                </button>
            </div>
            {items.map((item, index) => (
                <div key={item.id} className="flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Key"
                        value={item.key}
                        onChange={(e) => handleItemChange(item.id, 'key', e.target.value)}
                        className="w-full bg-hacker-dark border border-hacker-subtle rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hacker-accent text-gray-200"
                    />
                    <input
                        type="text"
                        placeholder="Value"
                        value={item.value}
                        onChange={(e) => handleItemChange(item.id, 'value', e.target.value)}
                        className="w-full bg-hacker-dark border border-hacker-subtle rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hacker-accent text-gray-200"
                    />
                    <button onClick={() => removeItem(item.id)} className="p-1 text-gray-500 hover:text-hacker-pink transition-colors">
                        <Trash2Icon className="w-5 h-5" />
                    </button>
                </div>
            ))}
        </div>
    );
};

interface FileUploadEditorProps {
    title: string;
    items: KeyFilePair[];
    setItems: (items: KeyFilePair[]) => void;
}

const FileUploadEditor: React.FC<FileUploadEditorProps> = ({ title, items, setItems }) => {
    const handleItemChange = (id: string, field: 'key' | 'file', value: string | FileList | null) => {
        setItems(items.map(item => {
            if (item.id === id) {
                if (field === 'key') {
                    return { ...item, key: value as string };
                }
                if (field === 'file') {
                    const fileList = value as FileList;
                    return { ...item, file: fileList && fileList.length > 0 ? fileList[0] : null };
                }
            }
            return item;
        }));
    };

    const addItem = () => {
        setItems([...items, { id: generateUniqueId(), key: '', file: null }]);
    };

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-300">{title}</h3>
                <button onClick={addItem} className="p-1 text-gray-400 hover:text-hacker-accent transition-colors">
                    <PlusCircleIcon className="w-5 h-5" />
                </button>
            </div>
            {items.map((item) => (
                <div key={item.id} className="grid grid-cols-[1fr_2fr_auto] items-center gap-2">
                    <input
                        type="text"
                        placeholder="Key (e.g., 'file')"
                        value={item.key}
                        onChange={(e) => handleItemChange(item.id, 'key', e.target.value)}
                        className="w-full bg-hacker-dark border border-hacker-subtle rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hacker-accent text-gray-200"
                    />
                    <div className="relative">
                        <input
                            type="file"
                            onChange={(e) => handleItemChange(item.id, 'file', e.target.files)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                         <div className="w-full bg-hacker-dark border border-hacker-subtle rounded-md px-3 py-2 text-sm text-gray-400 truncate">
                            {item.file ? item.file.name : 'Choose a file...'}
                        </div>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="p-1 text-gray-500 hover:text-hacker-pink transition-colors">
                        <Trash2Icon className="w-5 h-5" />
                    </button>
                </div>
            ))}
            <p className="text-xs text-gray-500 mt-2">
                Using this will send the request as `multipart/form-data`. The 'Body' tab content will be ignored.
            </p>
        </div>
    );
};


interface RequestPanelProps {
    requestData: RequestData;
    setRequestData: React.Dispatch<React.SetStateAction<RequestData>>;
    onSend: () => void;
    loading: boolean;
}

const RequestPanel: React.FC<RequestPanelProps> = ({ requestData, setRequestData, onSend, loading }) => {
    const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body' | 'files'>('body');
    const [isJsonValid, setIsJsonValid] = useState(true);
    
    const hasFiles = requestData.files.some(f => f.file);

    useEffect(() => {
        // If files are added, switch to POST method if not already a method that supports bodies.
        if (hasFiles && (requestData.method === 'GET' || requestData.method === 'HEAD')) {
            setRequestData(prev => ({ ...prev, method: 'POST' }));
        }
    }, [hasFiles, requestData.method, setRequestData]);

    const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const body = e.target.value;
        setRequestData(prev => ({ ...prev, body }));
        try {
            JSON.parse(body);
            setIsJsonValid(true);
        } catch (error) {
            if (body.trim() !== '') {
                setIsJsonValid(false);
            } else {
                setIsJsonValid(true);
            }
        }
    };
    
    const setQueryItems = (updater: React.SetStateAction<KeyValuePair[]>) => {
        setRequestData(p => ({ ...p, queryParams: typeof updater === 'function' ? updater(p.queryParams) : updater }));
    };
    
    const setHeaderItems = (updater: React.SetStateAction<KeyValuePair[]>) => {
        setRequestData(p => ({ ...p, headers: typeof updater === 'function' ? updater(p.headers) : updater }));
    };

    const setFileItems = (items: KeyFilePair[]) => {
      setRequestData(prev => ({...prev, files: items}));
    }

    const tabs: { id: 'params' | 'headers' | 'body' | 'files'; label: string }[] = [
        { id: 'params', label: 'Query Params' },
        { id: 'headers', label: 'Headers' },
        { id: 'body', label: 'Body' },
        { id: 'files', label: 'Files' },
    ];

    return (
        <div className="flex flex-col h-full bg-hacker-dark-panel p-4 rounded-lg border border-hacker-subtle">
            <div className="flex items-center space-x-2 mb-4">
                <select
                    value={requestData.method}
                    onChange={(e) => setRequestData(prev => ({ ...prev, method: e.target.value as HTTPMethod }))}
                    className="bg-hacker-dark border border-hacker-subtle rounded-md px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-hacker-accent w-32"
                >
                    {HTTP_METHODS.map(method => <option key={method}>{method}</option>)}
                </select>
                <input
                    type="text"
                    placeholder="https://your-n8n-instance.com/webhook/test"
                    value={requestData.url}
                    onChange={(e) => setRequestData(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full bg-hacker-dark border border-hacker-subtle rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hacker-accent text-gray-200"
                />
                <button
                    onClick={onSend}
                    disabled={loading}
                    className="bg-hacker-accent hover:bg-sky-400 text-hacker-dark font-bold py-2 px-6 rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                >
                    {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                        'Send'
                    )}
                </button>
            </div>

            <div className="border-b border-hacker-subtle mb-4">
                <nav className="flex space-x-4">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-hacker-accent text-hacker-green font-semibold' : 'border-transparent text-gray-400 hover:text-hacker-green'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="flex-grow overflow-y-auto pr-2">
                {activeTab === 'params' && <KeyValueEditor title="Query Parameters" items={requestData.queryParams} setItems={setQueryItems} />}
                {activeTab === 'headers' && <KeyValueEditor title="Headers" items={requestData.headers} setItems={setHeaderItems} />}
                {activeTab === 'body' && (
                    <div className="flex flex-col h-full">
                         {hasFiles ? (
                            <div className="flex items-center justify-center h-full bg-hacker-dark rounded-md border border-dashed border-hacker-yellow p-4">
                                <p className="text-center text-yellow-400 text-sm">
                                    File uploads are active. The raw body will be ignored.<br/>
                                    The request will be sent as `multipart/form-data`.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-semibold text-gray-300">Payload Templates</h3>
                                    <select
                                        onChange={(e) => setRequestData(prev => ({ ...prev, body: formatJson(e.target.value) }))}
                                        className="bg-hacker-dark border border-hacker-subtle rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-hacker-accent"
                                    >
                                        <option>Select a template...</option>
                                        {SAMPLE_PAYLOADS.map(payload => (
                                            <option key={payload.name} value={payload.data}>
                                                {payload.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="relative flex-grow">
                                    <textarea
                                        value={requestData.body}
                                        onChange={handleBodyChange}
                                        placeholder='{ "message": "Hello from n8n tester!" }'
                                        className={`w-full h-full bg-hacker-dark border ${isJsonValid ? 'border-hacker-subtle' : 'border-hacker-pink'} rounded-md p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-hacker-accent resize-none text-gray-200`}
                                    />
                                    {!isJsonValid && <div className="absolute bottom-2 right-2 text-xs text-hacker-pink">Invalid JSON</div>}
                                </div>
                            </>
                        )}
                    </div>
                )}
                {activeTab === 'files' && <FileUploadEditor title="Files (multipart/form-data)" items={requestData.files} setItems={setFileItems} />}
            </div>
        </div>
    );
};

interface ResponsePanelProps {
    response: ResponseData | null;
    loading: boolean;
}

const ResponsePanel: React.FC<ResponsePanelProps> = ({ response, loading }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!response?.body) return;
        navigator.clipboard.writeText(formatJson(response.body));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-hacker-dark-panel p-4 rounded-lg border border-hacker-subtle">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hacker-accent mb-4"></div>
                    <p className="text-lg">Sending request...</p>
                </div>
            </div>
        );
    }

    if (!response) {
        return (
            <div className="flex items-center justify-center h-full bg-hacker-dark-panel p-4 rounded-lg border border-hacker-subtle">
                <p className="text-gray-400">Response will be displayed here</p>
            </div>
        );
    }

    const isSuccess = response.status >= 200 && response.status < 300;
    const statusColor = isSuccess ? 'text-hacker-green' : 'text-hacker-pink';

    return (
        <div className="flex flex-col h-full bg-hacker-dark-panel p-4 rounded-lg border border-hacker-subtle">
            <h2 className="text-xl font-bold mb-3">Response</h2>
            <div className="flex items-center space-x-4 mb-4 text-sm">
                <div>Status: <span className={`font-bold ${statusColor}`}>{response.status}</span></div>
                <div>Time: <span className="font-bold text-hacker-blue">{response.responseTime} ms</span></div>
            </div>
            
            <details className="mb-4">
                <summary className="cursor-pointer text-sm font-semibold text-gray-300 hover:text-hacker-green">Response Headers</summary>
                <div className="mt-2 bg-hacker-dark rounded-md p-3 text-xs font-mono max-h-40 overflow-y-auto">
                    {Object.entries(response.headers).map(([key, value]) => (
                        <div key={key}><span className="text-gray-400">{key}:</span> {value}</div>
                    ))}
                </div>
            </details>
            
            <div className="relative flex-grow">
                <button onClick={handleCopy} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-hacker-green transition-colors">
                    {copied ? <span className="text-xs">Copied!</span> : <CopyIcon className="w-5 h-5" />}
                </button>
                <pre className="w-full h-full bg-hacker-dark rounded-md p-3 text-sm font-mono overflow-auto whitespace-pre-wrap break-all">
                    <code>{formatJson(response.body)}</code>
                </pre>
            </div>
        </div>
    );
};


interface HistoryPanelProps {
    history: HistoryItem[];
    onLoad: (item: HistoryItem) => void;
    onClear: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onLoad, onClear }) => (
    <div className="bg-hacker-dark-panel p-4 rounded-lg border border-hacker-subtle">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">History</h2>
            <button onClick={onClear} className="text-sm text-gray-400 hover:text-hacker-pink flex items-center gap-1">
                <Trash2Icon className="w-4 h-4"/>
                Clear
            </button>
        </div>
        <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
            {history.length === 0 ? (
                <p className="text-gray-500 text-sm">No recent requests.</p>
            ) : (
                history.map(item => (
                    <div key={item.id} onClick={() => onLoad(item)} className="p-3 bg-hacker-dark rounded-md cursor-pointer hover:bg-hacker-subtle transition-colors">
                        <div className="flex items-center space-x-3 text-sm">
                            <span className={`font-bold w-16 text-center ${item.method === 'POST' ? 'text-hacker-green' : item.method === 'GET' ? 'text-hacker-blue' : 'text-hacker-yellow'}`}>
                                {item.method}
                            </span>
                            <span className="text-gray-300 truncate">{item.url}</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
);


// --- Main App Component ---

export default function App() {
    const [requestData, setRequestData] = useState<RequestData>({
        method: 'POST',
        url: '',
        queryParams: [],
        headers: [{ id: generateUniqueId(), key: 'Content-Type', value: 'application/json' }],
        body: '',
        files: [],
    });
    const [response, setResponse] = useState<ResponseData | null>(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        const storedHistory = localStorage.getItem('n8n-webhook-tester-history');
        if (storedHistory) {
            setHistory(JSON.parse(storedHistory));
        }
    }, []);

    const sendRequest = useCallback(async () => {
        if (!requestData.url) {
            setResponse({
                status: 400,
                headers: {},
                body: JSON.stringify({ error: 'URL is required' }),
                responseTime: 0
            });
            return;
        }

        setLoading(true);
        setResponse(null);

        const startTime = Date.now();

        try {
            const url = new URL(requestData.url);
            requestData.queryParams.forEach(param => {
                if (param.key) url.searchParams.append(param.key, param.value);
            });
            
            const headers = new Headers();
            let body: BodyInit | undefined;
            const hasFiles = requestData.files.some(f => f.file);

            if (hasFiles) {
                const formData = new FormData();
                requestData.files.forEach(f => {
                    if (f.key && f.file) {
                        formData.append(f.key, f.file);
                    }
                });
                
                // Don't set Content-Type, browser does it for FormData
                requestData.headers.forEach(header => {
                    if (header.key && header.key.toLowerCase() !== 'content-type') {
                        headers.append(header.key, header.value);
                    }
                });
                body = formData;

            } else {
                requestData.headers.forEach(header => {
                    if (header.key) headers.append(header.key, header.value);
                });
                body = (requestData.method !== 'GET' && requestData.method !== 'HEAD') ? requestData.body : undefined;
            }


            const options: RequestInit = {
                method: requestData.method,
                headers: headers,
                body: body
            };

            const res = await fetch(url.toString(), options);
            const resBody = await res.text();
            const responseTime = Date.now() - startTime;

            const responseHeaders: { [key: string]: string } = {};
            res.headers.forEach((value, key) => {
                responseHeaders[key] = value;
            });
            
            setResponse({
                status: res.status,
                headers: responseHeaders,
                body: resBody,
                responseTime: responseTime
            });
            
            setHistory(prevHistory => {
                const historyItem: HistoryItem = {
                    ...requestData,
                    id: generateUniqueId(),
                    files: requestData.files.map(f => ({ id: f.id, key: f.key, file: null })),
                };
                const newHistory = [historyItem, ...prevHistory.filter(h => h.id !== historyItem.id)].slice(0, 20);
                localStorage.setItem('n8n-webhook-tester-history', JSON.stringify(newHistory));
                return newHistory;
            });

        } catch (error: any) {
            const responseTime = Date.now() - startTime;
            setResponse({
                status: 500,
                headers: {},
                body: JSON.stringify({ error: error.message, type: error.name }),
                responseTime: responseTime
            });
        } finally {
            setLoading(false);
        }
    }, [requestData]);
    
    const loadHistoryItem = (item: HistoryItem) => {
        setRequestData({
            method: item.method,
            url: item.url,
            queryParams: item.queryParams,
            headers: item.headers,
            body: item.body,
            files: item.files,
        });
        setShowHistory(false);
    };
    
    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('n8n-webhook-tester-history');
    };

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-hacker-green">n8n Webhook Tester</h1>
                    <p className="text-gray-400">Simulate and debug HTTP requests to your n8n webhooks.</p>
                </div>
                 <button onClick={() => setShowHistory(!showHistory)} className="flex items-center space-x-2 px-4 py-2 bg-hacker-dark-panel border border-hacker-subtle hover:border-hacker-accent rounded-md transition-colors">
                    <HistoryIcon className="w-5 h-5"/>
                    <span>History</span>
                </button>
            </header>

            {showHistory && <HistoryPanel history={history} onLoad={loadHistoryItem} onClear={clearHistory} />}

            <main className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{height: 'calc(100vh - 12rem)'}}>
                <RequestPanel requestData={requestData} setRequestData={setRequestData} onSend={sendRequest} loading={loading} />
                <ResponsePanel response={response} loading={loading} />
            </main>
        </div>
    );
}
