import {
    Button,
    Card,
    Center,
    Container,
    Group,
    Loader,
    Popover,
    SegmentedControl,
    Stack,
    Text,
    Tooltip,
    useMantineColorScheme,
    useMantineTheme
} from "@mantine/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import {useEffect, useRef, useState} from "react";
import {Calendar, Layers, Sun} from "lucide-react";
import {useTranslation} from "react-i18next";
import '@styles/CalendarView.module.css';
import dayjs from "dayjs";
import {motion} from "framer-motion";
import {useDisclosure} from "@mantine/hooks";

const getStartEndTime = (date) => {
    const start = dayjs(date).toISOString();
    const end = dayjs(date).add(15, 'minute').toISOString();
    return {start, end};
}
const EventCard = ({eventInfo, colorScheme, theme}) => {
    const [opened, {close, open}] = useDisclosure(false);
    const popoverRef = useRef(null);
    const {event} = eventInfo;
    const startTime = dayjs(event.start).format("h:mm A");
    const endTime = dayjs(event.end).format("h:mm A");
    return (
        <Popover
            transitionProps={{
                transition: 'scale',
                duration: 150,
            }}
            opened={opened}
            withinPortal
            styles={{
                dropdown: {
                    padding: 10,
                    borderRadius: theme.radius.md,
                    border: `1px solid ${theme.colors.gray[3]}`,
                    backgroundColor: colorScheme === 'light' ? theme.colors.brand[9] : theme.colors.gray[6],
                }
            }}
        >
            <Popover.Target>
                <Card
                    p={2}
                    onMouseEnter={open}
                    onMouseLeave={close}
                    ref={popoverRef}
                    w={'100%'}
                    radius={0}
                    bg={colorScheme === 'light' ? theme.colors.brand[9] : theme.colors.gray[6]}
                    className="cursor-pointer"
                >
                    <Center>
                        <Text c={theme.white} size="xs">
                            {startTime}
                        </Text>
                    </Center>
                </Card>
            </Popover.Target>

            <Popover.Dropdown>
                <Text c={theme.white} size="sm" fw={600}>
                    {eventInfo.event.title} <br/>
                </Text>
                <Stack gap={0}>
                    <Text size={'xs'} c={theme.white}>
                        {startTime} - {endTime}
                    </Text>
                </Stack>
            </Popover.Dropdown>
        </Popover>
    );
};

export function AppointmentsCalendarView({
                                             events = [],
                                             loading = false,
                                             handleEventClick,
                                             handleDateClick,
                                         }) {
    const calendarRef = useRef(null);
    const calendarApi = calendarRef.current?.getApi();
    const {t} = useTranslation();
    const [view, setView] = useState('timeGridDay');
    const theme = useMantineTheme();
    const {colorScheme} = useMantineColorScheme();
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const _appointments = events.map((event) => {
            const {start, end} = getStartEndTime(event.appointmentDate);
            return {
                title: event?.patientName || 'Appointment',
                start: start,
                end: end,
            };
        });
        setAppointments(_appointments);
    }, [events]);

    const viewItems = [
        {
            value: 'timeGridDay',
            label: (
                <Center style={{gap: 10}}>
                    <Tooltip label={t('day')}>
                        <Sun size={16}/>
                    </Tooltip>
                </Center>
            ),
        },
        {
            value: 'timeGridWeek',
            label: (
                <Center style={{gap: 10}}>
                    <Tooltip label={t('week')}>
                        <Layers size={16}/>
                    </Tooltip>
                </Center>
            ),
        },
        {
            value: 'dayGridMonth',
            label: (
                <Center style={{gap: 10}}>
                    <Tooltip label={t('month')}>
                        <Calendar size={16}/>
                    </Tooltip>
                </Center>
            ),
        },
    ];
    const handleViewChange = (view) => {
        const calendarApi = calendarRef.current?.getApi();
        setView(view);
        calendarApi.changeView(view);
        setViewTitle();
    }
    const handleNavigationChange = (direction) => {
        switch (direction) {
            case 'next':
                calendarApi.next();
                break;
            case 'prev':
                calendarApi.prev();
                break;
            case 'today':
                calendarApi.today();
                break;
        }
        setViewTitle();
    }
    const setViewTitle = () => {
        const dayTitleSelector = document.querySelector('.fc-timegrid-axis-cushion');
        if (dayTitleSelector) {
            const title = view === 'timeGridDay' ? t('day') : t('week');
            dayTitleSelector.innerHTML = `
                    <Text size="xs">${title}</Text>
                `;
        }
    }

    const renderEventContent = (eventInfo) => (
        <EventCard eventInfo={eventInfo} colorScheme={colorScheme} theme={theme}/>
    );

    const handleViewMount = () => setTimeout(() => setViewTitle(), 120);

    return (
        <Container fluid
        >
            {
                appointments.length > 0 ? (
                        <motion.div>
                            <Group position="apart" mb="md" justify={'space-between'}>
                                <Group gap={1}>
                                    <Button onClick={() => handleNavigationChange('prev')}
                                            style={{
                                                borderTopRightRadius: 0,
                                                borderBottomRightRadius: 0,
                                            }}
                                    >
                                        {t('previous')}
                                    </Button>
                                    <Button onClick={() => handleNavigationChange('next')}
                                            style={{
                                                minWidth: 100,
                                                borderRadius: 0,
                                            }}
                                    >
                                        {t('next')}
                                    </Button>
                                    <Button
                                        onClick={() => handleNavigationChange('today')}
                                        variant="filled"
                                        color="green"
                                        style={{
                                            minWidth: 100,
                                            borderTopLeftRadius: 0,
                                            borderBottomLeftRadius: 0,
                                        }}
                                    >
                                        {t('today')}
                                    </Button>
                                </Group>
                                <Group>
                                    <SegmentedControl
                                        onChange={handleViewChange}
                                        data={viewItems}
                                        transitionDuration={200}
                                        transitionTimingFunction="linear"
                                    />
                                </Group>
                            </Group>
                            <Group
                                styles={{
                                    root: {
                                        overflow: 'auto',
                                        maxHeight: '500px',
                                    }
                                }}
                            >
                                <FullCalendar
                                    headerToolbar={false}
                                    loading={() => loading}
                                    ref={calendarRef}
                                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                    initialView="timeGridDay"
                                    eventClick={handleEventClick}
                                    weekends={true}
                                    dateClick={handleDateClick}
                                    events={appointments}
                                    eventContent={renderEventContent}
                                    height={450}
                                    contentHeight={'auto'}
                                    slotLabelContent={(slotInfo) => {
                                        return (
                                            <div className={`px-2`}>
                                                <Text size={"xs"}>
                                                    {slotInfo.text}
                                                </Text>
                                            </div>
                                        );
                                    }}
                                    slotDuration="00:15:00"

                                    dayHeaderContent={(dayInfo) => {
                                        return (
                                            <div>
                                                <Text size={"xs"}>
                                                    {dayInfo.text}
                                                </Text>
                                            </div>
                                        );
                                    }}
                                    slotLabelFormat={{
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true,
                                    }}
                                    viewDidMount={handleViewMount}
                                />
                            </Group>
                        </motion.div>
                    )
                    : (
                        <Center>
                            <Loader/>
                        </Center>
                    )
            }
        </Container>
    )
}