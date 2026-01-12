import { IlamyCalendar, useIlamyCalendarContext } from "@ilamy/calendar";
import "dayjs/locale/pt-br";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import moment from "moment";
import { Button } from "../ui/button";

const CalendarHeader: React.FC = () => {
  const { prevPeriod, nextPeriod, view, setView } = useIlamyCalendarContext();

  return (
    <div className="flex items-center justify-between pb-2">
      <div className="flex items-center gap-2">
        <ChevronLeft
          className="cursor-pointer text-zinc-500"
          size={18}
          onClick={() => prevPeriod()}
        />
        <ChevronRight
          className="cursor-pointer text-zinc-500"
          size={18}
          onClick={() => nextPeriod()}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={view === "day" ? "default" : "outline"}
          onClick={() => setView("day")}
        >
          Dia
        </Button>
        <Button
          variant={view === "week" ? "default" : "outline"}
          onClick={() => setView("week")}
        >
          Semana
        </Button>
        <Button
          variant={view === "month" ? "default" : "outline"}
          onClick={() => setView("month")}
        >
          Mês
        </Button>

        {/* <Button variant="secondary">Hoje</Button> */}

        <Button className="ml-5">
          <Plus size={20} />
          Agendamento
        </Button>
      </div>
    </div>
  );
};

export const Calendar: React.FC = () => {
  return (
    <div className="h-full">
      <IlamyCalendar
        locale="pt-br"
        stickyViewHeader
        dayMaxEvents={2}
        headerComponent={<CalendarHeader />}
        disableDragAndDrop
        businessHours={{
          startTime: 9,
          endTime: 18,
        }}
        events={[
          {
            id: 1,
            title: "Teste",
            start: moment.utc().toDate(),
            end: moment.utc().add({ minutes: 160 }).toDate(),
            color: "white",
            backgroundColor: "#222",
            data: {
              customer: "Guilherme Stetes",
            },
          },
        ]}
        timeFormat="24-hour"
      />
    </div>
  );
};
