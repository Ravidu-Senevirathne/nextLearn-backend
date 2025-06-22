import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThan, MoreThan, Repository } from 'typeorm';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { Progress } from './entities/progress.entity';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private progressRepo: Repository<Progress>,
  ) { }

  create(createProgressDto: CreateProgressDto) {
    const progress = this.progressRepo.create(createProgressDto);
    return this.progressRepo.save(progress);
  }

  findAll() {
    return this.progressRepo.find();
  }

  findOne(id: string) {
    return this.progressRepo.findOne({ where: { id } });
  }

  update(id: string, updateProgressDto: UpdateProgressDto) {
    return this.progressRepo.update(id, updateProgressDto);
  }

  remove(id: string) {
    return this.progressRepo.delete(id);
  }

  async getOverviewStatistics(timeFrame: string = 'This Month', courseId?: string) {
    const dateRange = this.getDateRange(timeFrame);

    const query = this.progressRepo.createQueryBuilder('progress')
      .select([
        'AVG(progress.percentage) as overallCompletionRate',
        'COUNT(DISTINCT progress.userId) as totalActiveStudents',
      ])
      .where('progress.updatedAt BETWEEN :start AND :end', {
        start: dateRange.start,
        end: dateRange.end
      });

    if (courseId) {
      query.andWhere('progress.courseId = :courseId', { courseId });
    }

    const result = await query.getRawOne();

    // For demo purposes, mock some additional data
    const totalEnrolledStudents = result.totalActiveStudents * 1.2;

    return {
      overallCompletionRate: Math.round(result.overallCompletionRate || 0),
      totalActiveStudents: parseInt(result.totalActiveStudents) || 0,
      totalEnrolledStudents: Math.round(totalEnrolledStudents),
      activeStudentPercentage: Math.round(
        (result.totalActiveStudents / totalEnrolledStudents) * 100 || 0
      ),
    };
  }

  async getWeeklyProgress(weeks: number = 8, courseId?: string) {
    const weeklyData: { week: string; completion: number }[] = [];
    const now = new Date();

    for (let i = weeks - 1; i >= 0; i--) {
      const startDate = new Date(now);
      startDate.setDate(now.getDate() - (i * 7));
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

      const query = this.progressRepo.createQueryBuilder('progress')
        .select('AVG(progress.percentage)', 'completion')
        .where('progress.updatedAt BETWEEN :start AND :end', {
          start: startDate,
          end: endDate,
        });

      if (courseId) {
        query.andWhere('progress.courseId = :courseId', { courseId });
      }

      const result = await query.getRawOne();

      weeklyData.push({
        week: `${startDate.getMonth() + 1}/${startDate.getDate()}`,
        completion: Math.round(result.completion || 0),
      });
    }

    return weeklyData;
  }

  async getGradeDistribution(courseId?: string) {
    // Mock data for demo purposes - in a real app, connect to your grade repository
    const gradeRanges = [
      { min: 90, max: 100, grade: 'A' },
      { min: 80, max: 89, grade: 'B' },
      { min: 70, max: 79, grade: 'C' },
      { min: 60, max: 69, grade: 'D' },
      { min: 0, max: 59, grade: 'F' },
    ];

    return gradeRanges.map(range => ({
      grade: range.grade,
      count: Math.floor(Math.random() * 50) + 10,
      percentage: Math.floor(Math.random() * 30) + 5,
    }));
  }

  async getCourseProgress() {
    // Mock data for demo purposes - in a real app, join with courses
    return Array.from({ length: 5 }, (_, i) => ({
      id: `course-${i + 1}`,
      name: `Course ${i + 1}`,
      totalStudents: Math.floor(Math.random() * 100) + 50,
      activeStudents: Math.floor(Math.random() * 80) + 30,
      completionRate: Math.floor(Math.random() * 80) + 20,
    }));
  }

  async getEngagementData(timeFrame: string = 'This Month') {
    const dateRange = this.getDateRange(timeFrame);

    // For a real app, replace with actual DB queries
    const engagementCategories = [
      { category: 'High Engagement', min: 75, max: 100 },
      { category: 'Medium Engagement', min: 25, max: 74 },
      { category: 'Low Engagement', min: 0, max: 24 },
    ];

    const totalStudents = 400; // Mock total student count

    return engagementCategories.map(category => {
      const count = Math.floor(Math.random() * 200) + 50;
      return {
        category: category.category,
        count,
        percentage: Math.round((count / totalStudents) * 100),
      };
    });
  }

  async getTimeSpentData(timeFrame: string = 'This Month') {
    // Mock data for time spent
    return [
      {
        category: 'Less than 1 hour',
        count: 120,
        percentage: 30,
      },
      {
        category: '1-2 hours',
        count: 160,
        percentage: 40,
      },
      {
        category: '2-3 hours',
        count: 80,
        percentage: 20,
      },
      {
        category: 'More than 3 hours',
        count: 40,
        percentage: 10,
      },
    ];
  }

  private getDateRange(timeFrame: string) {
    const now = new Date();
    const start = new Date(now);

    switch (timeFrame) {
      case 'This Week':
        start.setDate(now.getDate() - now.getDay()); // Start of current week
        break;
      case 'This Month':
        start.setDate(1); // Start of current month
        break;
      case 'Last 3 Months':
        start.setMonth(now.getMonth() - 3);
        break;
      case 'This Year':
        start.setMonth(0, 1); // Start of current year
        break;
      case 'All Time':
        start.setFullYear(2000); // Arbitrary early date
        break;
      default:
        start.setMonth(now.getMonth() - 1); // Default to last month
    }

    return { start, end: now };
  }
}
