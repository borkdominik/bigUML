/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.manifest;

import com.eclipsesource.uml.glsp.core.manifest.DiagramManifest;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramCreateHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramDeleteHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramLabelEditMapperContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.DiagramUpdateHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.diagram.SuffixIdAppenderContribution;
import com.eclipsesource.uml.glsp.features.property_palette.manifest.contributions.DiagramElementPropertyMapperContribution;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.diagram.UmlUseCase_Actor;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.diagram.UmlUseCase_Association;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.diagram.UmlUseCase_Extend;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.diagram.UmlUseCase_Generalization;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.diagram.UmlUseCase_Include;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.diagram.UmlUseCase_Property;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.diagram.UmlUseCase_Subject;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.diagram.UmlUseCase_UseCase;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.features.label_edit.ActorLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.features.label_edit.AssociationLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.features.label_edit.SubjectLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.features.label_edit.UseCaseLabelEditMapper;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.features.property_palette.ActorPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.features.property_palette.AssociationPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.features.property_palette.GeneralizationPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.features.property_palette.PropertyPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.features.property_palette.SubjectPropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.features.property_palette.UseCasePropertyMapper;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.features.tool_palette.UseCaseToolPaletteConfiguration;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.gmodel.ActorNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.gmodel.AssociationEdgeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.gmodel.ExtendEdgeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.gmodel.GeneralizationEdgeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.gmodel.IncludeEdgeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.gmodel.SubjectNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.gmodel.UseCaseNodeMapper;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.gmodel.suffix.PropertyMultiplicityLabelSuffix;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.gmodel.suffix.PropertyTypeLabelSuffix;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.handler.operation.actor.CreateActorHandler;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.handler.operation.actor.DeleteActorHandler;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.handler.operation.actor.UpdateActorHandler;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.handler.operation.association.CreateAssociationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.handler.operation.association.DeleteAssociationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.handler.operation.association.UpdateAssociationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.handler.operation.extend.CreateExtendHandler;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.handler.operation.extend.DeleteExtendHandler;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.handler.operation.generalization.CreateGeneralizationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.handler.operation.generalization.DeleteGeneralizationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.handler.operation.generalization.UpdateGeneralizationHandler;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.handler.operation.include.CreateIncludeHandler;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.handler.operation.include.DeleteIncludeHandler;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.handler.operation.property.CreatePropertyHandler;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.handler.operation.property.DeletePropertyHandler;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.handler.operation.property.UpdatePropertyHandler;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.handler.operation.subject.CreateSubjectHandler;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.handler.operation.subject.DeleteSubjectHandler;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.handler.operation.subject.UpdateSubjectHandler;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.handler.operation.usecase.CreateUseCaseHandler;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.handler.operation.usecase.DeleteUseCaseHandler;
import com.eclipsesource.uml.glsp.uml.diagram.usecase_diagram.handler.operation.usecase.UpdateUseCaseHandler;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class UseCaseUmlManifest extends DiagramManifest
   implements DiagramCreateHandlerContribution,
   DiagramLabelEditMapperContribution,
   DiagramUpdateHandlerContribution,
   DiagramElementPropertyMapperContribution,
   DiagramDeleteHandlerContribution,
   SuffixIdAppenderContribution {

   @Override
   public String id() {
      return representation().getName();
   }

   @Override
   public Representation representation() {
      return Representation.USE_CASE;
   }

   @Override
   protected void configure() {
      super.configure();

      contributeDiagramElementConfiguration((nodes) -> {
         nodes.addBinding().to(UmlUseCase_UseCase.DiagramConfiguration.class);
         nodes.addBinding().to(UmlUseCase_Actor.DiagramConfiguration.class);
         nodes.addBinding().to(UmlUseCase_Property.DiagramConfiguration.class);
         nodes.addBinding().to(UmlUseCase_Subject.DiagramConfiguration.class);
      }, (edges) -> {
         edges.addBinding().to(UmlUseCase_Include.DiagramConfiguration.class);
         edges.addBinding().to(UmlUseCase_Extend.DiagramConfiguration.class);
         edges.addBinding().to(UmlUseCase_Association.DiagramConfiguration.class);
         edges.addBinding().to(UmlUseCase_Generalization.DiagramConfiguration.class);
      });

      contributeToolPaletteConfiguration((contribution) -> {
         contribution.addBinding().to(UseCaseToolPaletteConfiguration.class);
      });

      contributeSuffixIdAppenders((contribution) -> {
         contribution.addBinding(PropertyMultiplicityLabelSuffix.SUFFIX)
            .to(PropertyMultiplicityLabelSuffix.class);
         contribution.addBinding(PropertyTypeLabelSuffix.SUFFIX).to(PropertyTypeLabelSuffix.class);
      });

      contributeGModelMappers((contribution) -> {
         contribution.addBinding().to(UseCaseNodeMapper.class);
         contribution.addBinding().to(ActorNodeMapper.class);
         contribution.addBinding().to(AssociationEdgeMapper.class);
         contribution.addBinding().to(IncludeEdgeMapper.class);
         contribution.addBinding().to(ExtendEdgeMapper.class);
         contribution.addBinding().to(GeneralizationEdgeMapper.class);
         contribution.addBinding().to(SubjectNodeMapper.class);
      });

      contributeDiagramCreateHandlers((contribution) -> {
         contribution.addBinding().to(CreateUseCaseHandler.class);
         contribution.addBinding().to(CreateActorHandler.class);
         contribution.addBinding().to(CreatePropertyHandler.class);
         contribution.addBinding().to(CreateAssociationHandler.class);
         contribution.addBinding().to(CreateIncludeHandler.class);
         contribution.addBinding().to(CreateExtendHandler.class);
         contribution.addBinding().to(CreateGeneralizationHandler.class);
         contribution.addBinding().to(CreateSubjectHandler.class);
      });

      contributeDiagramUpdateHandlers((contribution) -> {
         contribution.addBinding().to(UpdateUseCaseHandler.class);
         contribution.addBinding().to(UpdateActorHandler.class);
         contribution.addBinding().to(UpdateAssociationHandler.class);
         contribution.addBinding().to(UpdatePropertyHandler.class);
         contribution.addBinding().to(UpdateGeneralizationHandler.class);
         contribution.addBinding().to(UpdateSubjectHandler.class);
      });

      contributeDiagramLabelEditMappers((contribution) -> {
         contribution.addBinding().to(UseCaseLabelEditMapper.class);
         contribution.addBinding().to(ActorLabelEditMapper.class);
         contribution.addBinding().to(AssociationLabelEditMapper.class);
         contribution.addBinding().to(SubjectLabelEditMapper.class);
      });

      contributeDiagramElementPropertyMappers((contribution) -> {
         contribution.addBinding().to(UseCasePropertyMapper.class);
         contribution.addBinding().to(ActorPropertyMapper.class);
         contribution.addBinding().to(AssociationPropertyMapper.class);
         contribution.addBinding().to(PropertyPropertyMapper.class);
         contribution.addBinding().to(GeneralizationPropertyMapper.class);
         contribution.addBinding().to(SubjectPropertyMapper.class);
      });

      contributeDiagramDeleteHandlers((contribution) -> {
         contribution.addBinding().to(DeleteUseCaseHandler.class);
         contribution.addBinding().to(DeleteActorHandler.class);
         contribution.addBinding().to(DeleteAssociationHandler.class);
         contribution.addBinding().to(DeleteIncludeHandler.class);
         contribution.addBinding().to(DeleteExtendHandler.class);
         contribution.addBinding().to(DeletePropertyHandler.class);
         contribution.addBinding().to(DeleteGeneralizationHandler.class);
         contribution.addBinding().to(DeleteSubjectHandler.class);
      });
   }
}
