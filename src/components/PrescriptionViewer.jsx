import {
    ActionIcon,
    BackgroundImage,
    Card,
    Center,
    CloseButton,
    Group,
    Text,
    Tooltip,
    useMantineTheme
} from "@mantine/core";
import {motion} from "framer-motion";
import {Expand, Info, PlusIcon, Trash2, ArrowLeft, ArrowRight, Plus, Minus} from "lucide-react";
import {forwardRef, useRef, useState} from "react";
import {Document, Page, pdfjs} from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = '/public/pdf.worker.min.mjs';


const PrescriptionViewer = forwardRef((props, ref) => {
    const {value = '', data = {}, handleDelete, onChange} = props;
    const [preview, setPreview] = useState(value);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const theme = useMantineTheme();
    const [fileName, setFileName] = useState('');

    const fileInputRef = useRef(null);
    const [numPages, setNumPages] = useState();
    const [pageNumber, setPageNumber] = useState(1);
    const [zIndex, setZIndex] = useState(0);
    const [scale, setScale] = useState(1);

    const handleFileChange = (file) => {
        if (file instanceof File) {
            const fileType = file.type;
            if (fileType.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = () => {
                    setPreview(reader.result);
                    setFileName(file.name);
                    onChange(file, 'img');
                };
                reader.readAsDataURL(file);
            } else if (fileType === "application/pdf") {
                const pdfUrl = URL.createObjectURL(file);
                setFileName(file.name);
                setPreview(pdfUrl);
                onChange(file, 'pdf');
            }
        }
    };

    const onDelete = (event, data) => {
        event.stopPropagation();
        handleDelete(data);
    }

    const handleCardClick = () => {
        if (!preview) fileInputRef.current.click();
    };

    const handleExpandToggle = (event) => {
        event.stopPropagation();
        setIsExpanded((prev) => !prev);
    };

    const onDocumentLoadSuccess = ({numPages}) => {
        setNumPages(numPages);
    }

    const goToNextPage = () => {
        if (pageNumber < numPages) {
            setPageNumber(pageNumber + 1);
        }
    };

    const goToPreviousPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };

    const zoomIn = () => {
        setScale(prevScale => prevScale + 0.1);
    };

    const zoomOut = () => {
        setScale(prevScale => Math.max(0.5, prevScale - 0.1));
    };

    return (
        <motion.div className="w-40 h-40 flex items-center justify-center">
            <input
                type="file"
                accept="image/*,application/pdf"
                style={{display: "none"}}
                onChange={(e) => handleFileChange(e.target.files[0])}
                ref={fileInputRef}
            />
            <motion.div
                layout
                className={`relative ${isExpanded ? "!fixed top-0 left-0 w-full h-full z-[100]" : "w-[150px]"}`}
                initial={{scale: 1}}
                animate={{
                    scale: isExpanded ? 1 : 1,
                    zIndex: isExpanded ? 9999 : 1,
                }}
                transition={{duration: 0.5}}
                onAnimationStart={() => {
                    if (!isExpanded) {
                        setZIndex(9999);
                    }
                }}
                onAnimationComplete={() => {
                    if (!isExpanded) {
                        setZIndex(1);
                    }
                }}
                style={{zIndex}}
                onClick={handleCardClick}
            >
                <Card
                    withBorder
                    shadow={isExpanded ? "xl" : "md"}
                    p={0}
                    className={`cursor-pointer ${isExpanded ? "!w-full !h-full !z-[1000]" : "h-[150px] w-[150px]"}`}
                >
                    {data?.type && preview ? (
                        <motion.div
                            className="h-full w-full relative"
                            onMouseEnter={() => setShowActions(true)}
                            onMouseLeave={() => setShowActions(false)}
                        >
                            {showActions && !isExpanded && (
                                <Group
                                    gap={5}
                                    justify={"end"}
                                    className="bg-white/80 absolute z-10 top-0 right-0 w-full"
                                >
                                    <Tooltip label={fileName}>
                                        <ActionIcon variant={"transparent"}>
                                            <Info size={16}/>
                                        </ActionIcon>
                                    </Tooltip>
                                    <Tooltip label={"Full Screen Preview"}>
                                        <ActionIcon onClick={handleExpandToggle} variant={"transparent"}>
                                            <Expand size={16}/>
                                        </ActionIcon>
                                    </Tooltip>
                                    <Tooltip label={"Remove File"}>
                                        <ActionIcon onClick={(event) => onDelete(event, data)} variant={"transparent"}>
                                            <Trash2 color={theme.colors.red[6]} size={16}/>
                                        </ActionIcon>
                                    </Tooltip>
                                </Group>
                            )}
                            {data?.type === "pdf" ? (
                                <div
                                    className={`relative ${isExpanded ? "w-full h-full" : "h-[150px] w-[150px]"} overflow-hidden`}
                                    style={{maxHeight: '90vh'}}
                                >
                                    <Document
                                        className="w-full"
                                        file={preview}
                                        onLoadSuccess={onDocumentLoadSuccess}
                                        onLoadError={(error) => console.error("Error loading PDF:", error)}
                                    >
                                        <Page pageNumber={pageNumber} scale={scale} />
                                    </Document>
                                    {isExpanded && numPages > 1 && (
                                        <div className="flex z-[40000] h-10 w-full !sticky bottom-4 !bg-white justify-between items-center my-2  px-4">
                                            <div className={`flex items-center justify-center gap-4`}>
                                                <ActionIcon
                                                    onClick={goToPreviousPage}
                                                    disabled={pageNumber === 1}
                                                >
                                                    <ArrowLeft size={16} />
                                                </ActionIcon>
                                                <ActionIcon onClick={zoomOut}>
                                                    <Minus size={16} />
                                                </ActionIcon>
                                                <ActionIcon onClick={zoomIn}>
                                                    <Plus size={16} />
                                                </ActionIcon>
                                            </div>
                                            <span>
                                                Page {pageNumber} of {numPages}
                                            </span>
                                            <ActionIcon
                                                onClick={goToNextPage}
                                                disabled={pageNumber === numPages}
                                            >
                                                <ArrowRight size={16} />
                                            </ActionIcon>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <BackgroundImage
                                    className="h-full w-full object-cover"
                                    src={preview}
                                />
                            )}
                            {isExpanded && (
                                <>
                                    <div
                                        className="absolute top-0 left-0 w-full h-full -z-10"
                                    />
                                    <CloseButton
                                        onClick={handleExpandToggle}
                                        style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            zIndex: 1001,
                                        }}
                                    />
                                </>
                            )}
                        </motion.div>
                    ) : (
                        <Center
                            bg={theme.colors.brand[9]}
                            c={theme.white}
                            className="w-full flex items-center justify-center flex-col h-full"
                        >
                            <PlusIcon size={20}/>
                            <Text size={"sm"}>Add File</Text>
                        </Center>
                    )}
                </Card>
            </motion.div>
        </motion.div>
    );
});

PrescriptionViewer.displayName = 'PrescriptionViewer';
export default PrescriptionViewer;

