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
package com.eclipsesource.uml.modelserver.uml.elements.manifestation;

import java.util.Collection;
import java.util.List;

import org.eclipse.emf.common.command.Command;
import org.eclipse.uml2.uml.Artifact;
import org.eclipse.uml2.uml.Manifestation;
import org.eclipse.uml2.uml.PackageableElement;

import com.eclipsesource.uml.modelserver.shared.codec.ContributionDecoder;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.notation.commands.AddEdgeNotationCommand;
import com.eclipsesource.uml.modelserver.uml.command.provider.element.EdgeCommandProvider;
import com.eclipsesource.uml.modelserver.uml.elements.manifestation.commands.CreateManifestationSemanticCommand;
import com.eclipsesource.uml.modelserver.uml.elements.manifestation.commands.UpdateManifestationArgument;
import com.eclipsesource.uml.modelserver.uml.elements.manifestation.commands.UpdateManifestationSemanticCommand;

public class ManifestationCommandProvider
   extends EdgeCommandProvider<Manifestation, Artifact, PackageableElement> {
   @Override
   protected Collection<Command> createModifications(final ModelContext context, final Artifact source,
      final PackageableElement target) {
      var semantic = new CreateManifestationSemanticCommand(context, source,
         target);
      var notation = new AddEdgeNotationCommand(context, semantic::getSemanticElement);
      return List.of(semantic, notation);
   }

   @Override
   protected Collection<Command> updateModifications(final ModelContext context, final Manifestation element) {
      var decoder = new ContributionDecoder(context);
      var update = decoder.embedJson(UpdateManifestationArgument.class);
      return List.of(new UpdateManifestationSemanticCommand(context, element, update));
   }
}
