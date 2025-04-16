
import React from "react";
import { useNavigate } from "react-router-dom";
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

const CurrentStatus = () => {
  const navigate = useNavigate();
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
    navigate("/preferences");
  };

  return (
    <FormLayout 
      title="Current Status Detail" 
      greeting="Hi, bedump tan"
      description="Let's keep building your profile together. We would like to hear more about you! Share some of your details before we get started."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Scholarship Type */}
        <div className="space-y-2">
          <Label>What's your scholarship type?</Label>
          <RadioGroup
            value={formData.currentStatus.scholarshipType}
            onValueChange={(value) => 
              updateCurrentStatus({ scholarshipType: value as "scholarship" | "selfFunded" })
            }
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="scholarship" id="scholarship" />
              <Label htmlFor="scholarship">Scholarship/Loan</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="selfFunded" id="self-funded" />
              <Label htmlFor="self-funded">Self-Funded</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Academic Qualification */}
        <div className="space-y-2">
          <Label>What's your current academic qualification?</Label>
          <Select
            value={formData.currentStatus.academicQualification}
            onValueChange={(value) => updateCurrentStatus({ academicQualification: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Academic Qualification" />
            </SelectTrigger>
            <SelectContent>
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
          <Label>What's your institution type?</Label>
          <RadioGroup
            value={formData.currentStatus.institutionType}
            onValueChange={(value) => 
              updateCurrentStatus({ institutionType: value as "malaysia" | "abroad" })
            }
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="malaysia" id="malaysia" />
              <Label htmlFor="malaysia">I'm studying in Malaysia or on exchange programme</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="abroad" id="abroad" />
              <Label htmlFor="abroad">I'm studying abroad</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Scope of Study */}
        <div className="space-y-2">
          <Label>What's your scope of study?</Label>
          <Select
            value={formData.currentStatus.scopeOfStudy}
            onValueChange={(value) => updateCurrentStatus({ scopeOfStudy: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Scope of Study" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="business">Business & Management</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="computer-science">Computer Science</SelectItem>
              <SelectItem value="medicine">Medicine</SelectItem>
              <SelectItem value="arts">Arts & Humanities</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="law">Law</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Enrollment Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>When's your university enrollment date?</Label>
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
                  {enrollmentDate ? format(enrollmentDate, "dd/MM/yyyy") : <span>dd/mm/yyyy</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={enrollmentDate}
                  onSelect={(date) => {
                    setEnrollmentDate(date);
                    if (date) {
                      updateCurrentStatus({ enrollmentDate: date.toISOString() });
                    }
                  }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Graduation Date */}
          <div className="space-y-2">
            <Label>When's your expected graduation date?</Label>
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
                  {graduationDate ? format(graduationDate, "dd/MM/yyyy") : <span>dd/mm/yyyy</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={graduationDate}
                  onSelect={(date) => {
                    setGraduationDate(date);
                    if (date) {
                      updateCurrentStatus({ graduationDate: date.toISOString() });
                    }
                  }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Current Year */}
        <div className="space-y-2">
          <Label>What's the current year of your study?</Label>
          <Select
            value={formData.currentStatus.currentYear}
            onValueChange={(value) => updateCurrentStatus({ currentYear: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Please select your current year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Year 1</SelectItem>
              <SelectItem value="2">Year 2</SelectItem>
              <SelectItem value="3">Year 3</SelectItem>
              <SelectItem value="4">Year 4</SelectItem>
              <SelectItem value="5">Year 5</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grade Type */}
        <div className="space-y-2">
          <Label>What's your current grade</Label>
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
              <RadioGroupItem value="others" id="others" />
              <Label htmlFor="others">Others</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="no-grade" />
              <Label htmlFor="no-grade">No Current Grade</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Grade Value */}
        {formData.currentStatus.gradeType !== "none" && (
          <div className="space-y-2">
            <Label htmlFor="grade">Enter your grade</Label>
            <Input
              id="grade"
              value={formData.currentStatus.grade}
              onChange={(e) => updateCurrentStatus({ grade: e.target.value })}
              placeholder={
                formData.currentStatus.gradeType === "cgpa" 
                  ? "E.g., 3.75"
                  : formData.currentStatus.gradeType === "grade"
                    ? "E.g., A, B+"
                    : "E.g., First Class Honours"
              }
            />
          </div>
        )}

        {/* English Test */}
        <div className="space-y-2">
          <Label>What's the english equivalency test you've taken?</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="muet" 
                id="muet"
                checked={formData.currentStatus.englishTest === "muet"}
                onClick={() => updateCurrentStatus({ englishTest: "muet" })}
              />
              <Label htmlFor="muet">MUET</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="cefr" 
                id="cefr" 
                checked={formData.currentStatus.englishTest === "cefr"}
                onClick={() => updateCurrentStatus({ englishTest: "cefr" })}
              />
              <Label htmlFor="cefr">CEFR</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="toefl" 
                id="toefl" 
                checked={formData.currentStatus.englishTest === "toefl"}
                onClick={() => updateCurrentStatus({ englishTest: "toefl" })}
              />
              <Label htmlFor="toefl">TOEFL</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="ielts" 
                id="ielts" 
                checked={formData.currentStatus.englishTest === "ielts"}
                onClick={() => updateCurrentStatus({ englishTest: "ielts" })}
              />
              <Label htmlFor="ielts">IELTS</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="other" 
                id="other-test" 
                checked={formData.currentStatus.englishTest === "other"}
                onClick={() => updateCurrentStatus({ englishTest: "other" })}
              />
              <Label htmlFor="other-test">Other</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="none" 
                id="no-test" 
                checked={formData.currentStatus.englishTest === "none"}
                onClick={() => updateCurrentStatus({ englishTest: "none" })}
              />
              <Label htmlFor="no-test">I have not taken any tests</Label>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="pt-4 flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              prevStep();
              navigate("/personal-information");
            }}
          >
            Back
          </Button>
          <Button type="submit">Next</Button>
        </div>
      </form>
    </FormLayout>
  );
};

export default CurrentStatus;
