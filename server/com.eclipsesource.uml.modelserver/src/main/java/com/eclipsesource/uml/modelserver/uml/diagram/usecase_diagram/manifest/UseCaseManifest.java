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
package com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.manifest;

import com.eclipsesource.uml.modelserver.core.manifest.DiagramManifest;
import com.eclipsesource.uml.modelserver.core.manifest.contributions.CommandCodecContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.actor.CreateActorContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.actor.DeleteActorContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.actor.UpdateActorContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.association.CreateAssociationContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.association.DeleteAssociationContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.association.UpdateAssociationContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.extend.CreateExtendContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.extend.DeleteExtendContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.generalization.CreateGeneralizationContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.generalization.DeleteGeneralizationContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.generalization.UpdateGeneralizationContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.include.CreateIncludeContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.include.DeleteIncludeContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.property.CreatePropertyContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.property.DeletePropertyContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.property.UpdatePropertyContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.subject.CreateSubjectContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.subject.DeleteSubjectContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.subject.UpdateSubjectContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.usecase.CreateUseCaseContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.usecase.DeleteUseCaseContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.usecase_diagram.commands.usecase.UpdateUseCaseContribution;

public class UseCaseManifest extends DiagramManifest implements CommandCodecContribution {

   @Override
   protected void configure() {
      super.configure();
      contributeCommandCodec(binder(), (contributions) -> {
         // UseCase
         contributions.addBinding(CreateUseCaseContribution.TYPE).to(CreateUseCaseContribution.class);
         contributions.addBinding(UpdateUseCaseContribution.TYPE).to(UpdateUseCaseContribution.class);
         contributions.addBinding(DeleteUseCaseContribution.TYPE).to(DeleteUseCaseContribution.class);

         // Actor
         contributions.addBinding(CreateActorContribution.TYPE).to(CreateActorContribution.class);
         contributions.addBinding(UpdateActorContribution.TYPE).to(UpdateActorContribution.class);
         contributions.addBinding(DeleteActorContribution.TYPE).to(DeleteActorContribution.class);

         // Include (UseCase -> UseCase)
         contributions.addBinding(CreateIncludeContribution.TYPE).to(CreateIncludeContribution.class);
         contributions.addBinding(DeleteIncludeContribution.TYPE).to(DeleteIncludeContribution.class);

         // Extend (UseCase -> UseCase)
         contributions.addBinding(CreateExtendContribution.TYPE).to(CreateExtendContribution.class);
         contributions.addBinding(DeleteExtendContribution.TYPE).to(DeleteExtendContribution.class);

         // Association
         contributions.addBinding(CreateAssociationContribution.TYPE).to(CreateAssociationContribution.class);
         contributions.addBinding(DeleteAssociationContribution.TYPE).to(DeleteAssociationContribution.class);
         contributions.addBinding(UpdateAssociationContribution.TYPE).to(UpdateAssociationContribution.class);

         contributions.addBinding(CreatePropertyContribution.TYPE).to(CreatePropertyContribution.class);
         contributions.addBinding(DeletePropertyContribution.TYPE).to(DeletePropertyContribution.class);
         contributions.addBinding(UpdatePropertyContribution.TYPE).to(UpdatePropertyContribution.class);

         // Generalization
         contributions.addBinding(CreateGeneralizationContribution.TYPE).to(CreateGeneralizationContribution.class);
         contributions.addBinding(UpdateGeneralizationContribution.TYPE).to(UpdateGeneralizationContribution.class);
         contributions.addBinding(DeleteGeneralizationContribution.TYPE).to(DeleteGeneralizationContribution.class);

         // Subject
         contributions.addBinding(CreateSubjectContribution.TYPE).to(CreateSubjectContribution.class);
         contributions.addBinding(DeleteSubjectContribution.TYPE).to(DeleteSubjectContribution.class);
         contributions.addBinding(UpdateSubjectContribution.TYPE).to(UpdateSubjectContribution.class);
      });
   }
}
