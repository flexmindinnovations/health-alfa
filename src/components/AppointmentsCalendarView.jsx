import {Button, Center, Container, Group, SegmentedControl, Text, Tooltip, useMantineTheme} from "@mantine/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import {useRef, useState} from "react";
import {Calendar, Layers, Sun} from "lucide-react";
import {useTranslation} from "react-i18next";
import '@styles/CalendarView.module.css';

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
        setView(view);
        calendarApi.changeView(view);
        const dayTitleSelector = document.querySelector('.fc-timegrid-axis-cushion');
        if (dayTitleSelector) {
            const title = view === 'timeGridDay' ? t('day') :
                view === 'timeGridWeek' ? t('week') :
                    t('month');
            console.log('title', title);
            dayTitleSelector.innerHTML = `
                    <Text size="xs">${title}</Text>
                `;
        }
    }

    const renderEventContent = (eventInfo) => (
        <div>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </div>
    );

    const handleViewMount = () => {
        setTimeout(() => {
            const dayTitleSelector = document.querySelector('.fc-timegrid-axis-cushion');
            if (dayTitleSelector) {
                const title = view === 'timeGridDay' ? t('day') :
                    view === 'timeGridWeek' ? t('week') :
                        t('month');
                console.log('title', title);
                dayTitleSelector.innerHTML = `
                    <Text size="xs">${title}</Text>
                `;
            }
        }, 200)
    }

    return (
        <Container fluid
        >
            <Group position="apart" mb="md" justify={'space-between'}>
                <Group gap={1}>
                    <Button onClick={() => calendarApi.prev()}
                            style={{
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                            }}
                    >
                        Previous
                    </Button>
                    <Button onClick={() => calendarApi.next()}
                            style={{
                                minWidth: 100,
                                borderRadius: 0,
                            }}
                    >
                        Next
                    </Button>
                    <Button
                        onClick={() => calendarApi.today()}
                        variant="filled"
                        color="green"
                        style={{
                            minWidth: 100,
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                        }}
                    >
                        Today
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
                    loading={loading}
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridDay"
                    eventClick={handleEventClick}
                    weekends={true}
                    dateClick={handleDateClick}
                    events={events}
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
                                {console.log(dayInfo)}
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
        </Container>
    )
}