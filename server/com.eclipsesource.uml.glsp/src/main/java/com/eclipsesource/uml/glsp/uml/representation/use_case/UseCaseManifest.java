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
package com.eclipsesource.uml.glsp.uml.representation.use_case;

import com.eclipsesource.uml.glsp.core.manifest.DiagramManifest;
import com.eclipsesource.uml.glsp.uml.elements.actor.ActorDefinitionModule;
import com.eclipsesource.uml.glsp.uml.elements.association.AssociationDefinitionModule;
import com.eclipsesource.uml.glsp.uml.elements.extend.ExtendDefinitionModule;
import com.eclipsesource.uml.glsp.uml.elements.generalization.GeneralizationDefinitionModule;
import com.eclipsesource.uml.glsp.uml.elements.include.IncludeDefinitionModule;
import com.eclipsesource.uml.glsp.uml.elements.property.PropertyDefinitionModule;
import com.eclipsesource.uml.glsp.uml.elements.subject.SubjectDefinitionModule;
import com.eclipsesource.uml.glsp.uml.elements.usecase.UseCaseDefinitionModule;
import com.eclipsesource.uml.modelserver.unotation.Representation;

public class UseCaseManifest extends DiagramManifest {

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

      install(new ActorDefinitionModule(this));
      install(new AssociationDefinitionModule(this));
      // install(new UseCaseAssociationDefinitionModule(this));
      install(new ExtendDefinitionModule(this));
      install(new GeneralizationDefinitionModule(this));
      install(new IncludeDefinitionModule(this));
      install(new PropertyDefinitionModule(this));
      install(new SubjectDefinitionModule(this));
      install(new UseCaseDefinitionModule(this));

      contributeToolPaletteConfiguration((contribution) -> {
         contribution.addBinding().to(UseCaseToolPaletteConfiguration.class);
      });
   }
}
