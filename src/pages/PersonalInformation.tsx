
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

const PersonalInformation = () => {
  const navigate = useNavigate();
  const { formData, updatePersonalInfo, nextStep } = useFormData();
  const [date, setDate] = React.useState<Date | undefined>(
    formData.personalInfo.dateOfBirth 
      ? new Date(formData.personalInfo.dateOfBirth) 
      : undefined
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
    navigate("/current-status");
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      updatePersonalInfo({ dateOfBirth: selectedDate.toISOString() });
    }
  };

  return (
    <FormLayout 
      title="Personal Information" 
      greeting="WELCOME ONBOARD TO MyNext!"
      description="A dedicated platform designed to help you evaluate and enhance your skills, acquire new competencies, and explore career opportunities. Share some of your details before we get started."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identification Type */}
        <div className="space-y-2">
          <Label>Identification Type</Label>
          <RadioGroup
            value={formData.personalInfo.identificationType}
            onValueChange={(value) => 
              updatePersonalInfo({ identificationType: value as "malaysianIC" | "passportNumber" })
            }
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="malaysianIC" id="malaysian-ic" />
              <Label htmlFor="malaysian-ic">Malaysian IC</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="passportNumber" id="passport" />
              <Label htmlFor="passport">Passport Number</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Identification Number */}
        <div className="space-y-2">
          <Label htmlFor="identification-number">Please insert your identification number</Label>
          <p className="text-sm text-gray-500 mb-1">Please fill in without the "-" symbol</p>
          <Input
            id="identification-number"
            value={formData.personalInfo.identificationNumber}
            onChange={(e) => updatePersonalInfo({ identificationNumber: e.target.value })}
          />
        </div>

        {/* Full Name and Display Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="full-name">Full Name (as per passport or IC)</Label>
            <Input
              id="full-name"
              value={formData.personalInfo.fullName}
              onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="display-name">Display Name (optional)</Label>
            <Input
              id="display-name"
              value={formData.personalInfo.displayName}
              onChange={(e) => updatePersonalInfo({ displayName: e.target.value })}
            />
          </div>
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label>Gender</Label>
          <RadioGroup
            value={formData.personalInfo.gender}
            onValueChange={(value) => 
              updatePersonalInfo({ gender: value as "male" | "female" })
            }
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <Label>Date of Birth</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "dd/MM/yyyy") : <span>dd/mm/yyyy</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Phone Number and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone-number">Phone Number</Label>
            <Input
              id="phone-number"
              value={formData.personalInfo.phoneNumber}
              onChange={(e) => updatePersonalInfo({ phoneNumber: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.personalInfo.email}
              onChange={(e) => updatePersonalInfo({ email: e.target.value })}
            />
          </div>
        </div>

        {/* Nationality */}
        <div className="space-y-2">
          <Label>Nationality</Label>
          <RadioGroup
            value={formData.personalInfo.nationality}
            onValueChange={(value) => 
              updatePersonalInfo({ nationality: value as "malaysian" | "nonMalaysian" })
            }
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="malaysian" id="malaysian" />
              <Label htmlFor="malaysian">Malaysian</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nonMalaysian" id="non-malaysian" />
              <Label htmlFor="non-malaysian">Non-Malaysian</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Race */}
        <div className="space-y-2">
          <Label htmlFor="race">Race</Label>
          <Select
            value={formData.personalInfo.race}
            onValueChange={(value) => updatePersonalInfo({ race: value })}
          >
            <SelectTrigger id="race">
              <SelectValue placeholder="Select Race" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="malay">Malay</SelectItem>
              <SelectItem value="chinese">Chinese</SelectItem>
              <SelectItem value="indian">Indian</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label>Where do you stay?</Label>
          <Select
            value={formData.personalInfo.country}
            onValueChange={(value) => updatePersonalInfo({ country: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="malaysia">Malaysia</SelectItem>
              <SelectItem value="singapore">Singapore</SelectItem>
              <SelectItem value="indonesia">Indonesia</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* State and City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select
              value={formData.personalInfo.state}
              onValueChange={(value) => updatePersonalInfo({ state: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="johor">Johor</SelectItem>
                <SelectItem value="kedah">Kedah</SelectItem>
                <SelectItem value="kelantan">Kelantan</SelectItem>
                <SelectItem value="melaka">Melaka</SelectItem>
                <SelectItem value="negeri-sembilan">Negeri Sembilan</SelectItem>
                <SelectItem value="pahang">Pahang</SelectItem>
                <SelectItem value="penang">Penang</SelectItem>
                <SelectItem value="perak">Perak</SelectItem>
                <SelectItem value="perlis">Perlis</SelectItem>
                <SelectItem value="sabah">Sabah</SelectItem>
                <SelectItem value="sarawak">Sarawak</SelectItem>
                <SelectItem value="selangor">Selangor</SelectItem>
                <SelectItem value="terengganu">Terengganu</SelectItem>
                <SelectItem value="kuala-lumpur">Kuala Lumpur</SelectItem>
                <SelectItem value="labuan">Labuan</SelectItem>
                <SelectItem value="putrajaya">Putrajaya</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.personalInfo.city}
              onChange={(e) => updatePersonalInfo({ city: e.target.value })}
            />
          </div>
        </div>

        {/* Postcode */}
        <div className="w-1/2 space-y-2">
          <Label htmlFor="postcode">Postcode</Label>
          <Input
            id="postcode"
            value={formData.personalInfo.postcode}
            onChange={(e) => updatePersonalInfo({ postcode: e.target.value })}
          />
        </div>

        {/* OKU */}
        <div className="space-y-2">
          <Label>Are you registered with Department of Social Welfare Malaysia as a person with Disabilities (OKU)?</Label>
          <RadioGroup
            value={formData.personalInfo.isOKU ? "yes" : "no"}
            onValueChange={(value) => 
              updatePersonalInfo({ isOKU: value === "yes" })
            }
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="oku-yes" />
              <Label htmlFor="oku-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="oku-no" />
              <Label htmlFor="oku-no">No</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Navigation Buttons */}
        <div className="pt-4 flex justify-end">
          <Button type="submit">Next</Button>
        </div>
      </form>
    </FormLayout>
  );
};

export default PersonalInformation;
