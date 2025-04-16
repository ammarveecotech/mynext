import React from "react";
import { useRouter } from "next/router";
import FormLayout from "@/components/FormLayout";
import { useFormData } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function CurrentStatus() {
  const router = useRouter();
  const { formData, updateCurrentStatus, nextStep, prevStep } = useFormData();
  const [enrollmentDate, setEnrollmentDate] = React.useState<Date | undefined>(
    formData.currentStatus.enrollmentDate 
      ? new Date(formData.currentStatus.enrollmentDate) 
      : undefined
  );
  const [graduationDate, setGraduationDate] = React.useState<Date | undefined>(
    formData.currentStatus.graduationDate 
      ? new Date(formData.currentStatus.graduationDate) 
      : undefined
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
    router.push("/preferences");
  };

  const handleBack = () => {
    prevStep();
    router.push("/personal-information");
  };

  const handleEnrollmentDateChange = (selectedDate: Date | undefined) => {
    setEnrollmentDate(selectedDate);
    if (selectedDate) {
      updateCurrentStatus({ enrollmentDate: selectedDate.toISOString() });
    }
  };

  const handleGraduationDateChange = (selectedDate: Date | undefined) => {
    setGraduationDate(selectedDate);
    if (selectedDate) {
      updateCurrentStatus({ graduationDate: selectedDate.toISOString() });
    }
  };

  return (
    <FormLayout
      title="Current Status"
      description="Tell us more about your academic journey and qualifications"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Scholarship Type */}
        <div className="space-y-2">
          <Label>Scholarship Type</Label>
          <RadioGroup
            value={formData.currentStatus.scholarshipType}
            onValueChange={(value) => 
              updateCurrentStatus({ scholarshipType: value as "scholarship" | "selfFunded" })
            }
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="scholarship" id="scholarship" />
              <Label htmlFor="scholarship">Scholarship</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="selfFunded" id="self-funded" />
              <Label htmlFor="self-funded">Self-Funded</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Academic Qualification */}
        <div className="space-y-2">
          <Label htmlFor="academic-qualification">Academic Qualification</Label>
          <Select
            value={formData.currentStatus.academicQualification}
            onValueChange={(value) => updateCurrentStatus({ academicQualification: value })}
          >
            <SelectTrigger id="academic-qualification">
              <SelectValue placeholder="Select your highest qualification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="highSchool">High School</SelectItem>
              <SelectItem value="diploma">Diploma</SelectItem>
              <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
              <SelectItem value="master">Master's Degree</SelectItem>
              <SelectItem value="phd">PhD</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Institution Type */}
        <div className="space-y-2">
          <Label>Institution Type</Label>
          <RadioGroup
            value={formData.currentStatus.institutionType}
            onValueChange={(value) => 
              updateCurrentStatus({ institutionType: value as "malaysia" | "abroad" })
            }
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="malaysia" id="malaysia-institution" />
              <Label htmlFor="malaysia-institution">Malaysia</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="abroad" id="abroad-institution" />
              <Label htmlFor="abroad-institution">Abroad</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Scope of Study */}
        <div className="space-y-2">
          <Label htmlFor="scope-of-study">Scope of Study</Label>
          <Input
            id="scope-of-study"
            value={formData.currentStatus.scopeOfStudy}
            onChange={(e) => updateCurrentStatus({ scopeOfStudy: e.target.value })}
            placeholder="e.g., Computer Science, Medicine, etc."
          />
        </div>

        {/* Enrollment Date */}
        <div className="space-y-2">
          <Label>Enrollment Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !enrollmentDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {enrollmentDate ? format(enrollmentDate, "dd/MM/yyyy") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={enrollmentDate}
                onSelect={handleEnrollmentDateChange}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Graduation Date */}
        <div className="space-y-2">
          <Label>Graduation Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !graduationDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {graduationDate ? format(graduationDate, "dd/MM/yyyy") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={graduationDate}
                onSelect={handleGraduationDateChange}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Current Year */}
        <div className="space-y-2">
          <Label htmlFor="current-year">Current Year</Label>
          <Select
            value={formData.currentStatus.currentYear}
            onValueChange={(value) => updateCurrentStatus({ currentYear: value })}
          >
            <SelectTrigger id="current-year">
              <SelectValue placeholder="Select your current year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="year1">Year 1</SelectItem>
              <SelectItem value="year2">Year 2</SelectItem>
              <SelectItem value="year3">Year 3</SelectItem>
              <SelectItem value="year4">Year 4</SelectItem>
              <SelectItem value="year5">Year 5</SelectItem>
              <SelectItem value="graduated">Graduated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grade Type */}
        <div className="space-y-2">
          <Label>Grade Type</Label>
          <RadioGroup
            value={formData.currentStatus.gradeType}
            onValueChange={(value) => 
              updateCurrentStatus({ gradeType: value as "cgpa" | "grade" | "others" | "none" })
            }
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cgpa" id="cgpa" />
              <Label htmlFor="cgpa">CGPA</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="grade" id="grade" />
              <Label htmlFor="grade">Grade</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="others" id="others-grade" />
              <Label htmlFor="others-grade">Others</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="none-grade" />
              <Label htmlFor="none-grade">None</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Grade */}
        {formData.currentStatus.gradeType !== "none" && (
          <div className="space-y-2">
            <Label htmlFor="grade">Your {formData.currentStatus.gradeType === "cgpa" ? "CGPA" : "Grade"}</Label>
            <Input
              id="grade"
              value={formData.currentStatus.grade}
              onChange={(e) => updateCurrentStatus({ grade: e.target.value })}
              placeholder={formData.currentStatus.gradeType === "cgpa" ? "e.g., 3.5" : "e.g., A, B+, etc."}
            />
          </div>
        )}

        {/* English Test */}
        <div className="space-y-2">
          <Label>English Test</Label>
          <RadioGroup
            value={formData.currentStatus.englishTest}
            onValueChange={(value) => 
              updateCurrentStatus({ englishTest: value as "muet" | "cefr" | "toefl" | "ielts" | "other" | "none" })
            }
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="muet" id="muet" />
              <Label htmlFor="muet">MUET</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cefr" id="cefr" />
              <Label htmlFor="cefr">CEFR</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="toefl" id="toefl" />
              <Label htmlFor="toefl">TOEFL</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ielts" id="ielts" />
              <Label htmlFor="ielts">IELTS</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other-test" />
              <Label htmlFor="other-test">Other</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="none-test" />
              <Label htmlFor="none-test">None</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
          >
            Next Step
          </Button>
        </div>
      </form>
    </FormLayout>
  );
} 