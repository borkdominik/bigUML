/********************************************************************************
 * Copyright (c) 2021-2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.modelserver;

import org.eclipse.emfcloud.modelserver.common.Routing;
import org.eclipse.emfcloud.modelserver.common.utils.MapBinding;
import org.eclipse.emfcloud.modelserver.common.utils.MultiBinding;
import org.eclipse.emfcloud.modelserver.edit.CommandContribution;
import org.eclipse.emfcloud.modelserver.emf.common.ModelResourceManager;
import org.eclipse.emfcloud.modelserver.emf.common.ResourceSetFactory;
import org.eclipse.emfcloud.modelserver.emf.common.codecs.CodecProvider;
import org.eclipse.emfcloud.modelserver.emf.configuration.EPackageConfiguration;
import org.eclipse.emfcloud.modelserver.notation.integration.EMSNotationModelServerModule;
import org.eclipse.emfcloud.modelserver.notation.integration.NotationPackageConfiguration;
import org.eclipse.uml2.uml.resource.UMLResource;

import com.eclipsesource.uml.modelserver.codecs.UmlCodecProvider;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.ChangeBoundsCommandContribution;
import com.eclipsesource.uml.modelserver.commands.commons.contributions.ChangeRoutingPointsCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.interaction.AddInteractionCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.interaction.CopyInteractionCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.interaction.RemoveInteractionCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.interaction.SetInteractionNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.lifeline.AddLifelineCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.lifeline.CopyLifelineWithMessagesCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.lifeline.RemoveLifelineCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.lifeline.SetLifelineNameCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.message.AddMessageCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.message.RemoveMessageCommandContribution;
import com.eclipsesource.uml.modelserver.commands.communication.message.SetMessageNameCommandContribution;
import com.eclipsesource.uml.modelserver.resource.UmlNotationPackageConfiguration;
import com.eclipsesource.uml.modelserver.resource.UmlNotationResource;
import com.eclipsesource.uml.modelserver.resource.UmlPackageConfiguration;

public class UmlModelServerModule extends EMSNotationModelServerModule {

   @Override
   protected Class<? extends ModelResourceManager> bindModelResourceManager() {
      return UmlModelResourceManager.class;
   }

   @Override
   protected Class<? extends ResourceSetFactory> bindResourceSetFactory() {
      return UmlResourceSetFactory.class;
   }

   @Override
   protected String getSemanticFileExtension() { return UMLResource.FILE_EXTENSION; }

   @Override
   protected String getNotationFileExtension() { return UmlNotationResource.FILE_EXTENSION; }

   @Override
   protected void configureEPackages(final MultiBinding<EPackageConfiguration> binding) {
      super.configureEPackages(binding);
      binding.remove(NotationPackageConfiguration.class);
      binding.add(UmlPackageConfiguration.class);
      binding.add(UmlNotationPackageConfiguration.class);
   }

   @Override
   protected void configureCommandCodecs(final MapBinding<String, CommandContribution> binding) {
      super.configureCommandCodecs(binding);
      // COMMONS
      binding.put(ChangeBoundsCommandContribution.TYPE, ChangeBoundsCommandContribution.class);
      binding.put(ChangeRoutingPointsCommandContribution.TYPE, ChangeRoutingPointsCommandContribution.class);

      // UML Communication
      binding.put(AddInteractionCommandContribution.TYPE, AddInteractionCommandContribution.class);
      binding.put(SetInteractionNameCommandContribution.TYPE, SetInteractionNameCommandContribution.class);
      binding.put(RemoveInteractionCommandContribution.TYPE, RemoveInteractionCommandContribution.class);
      binding.put(AddLifelineCommandContribution.TYPE, AddLifelineCommandContribution.class);
      binding.put(RemoveLifelineCommandContribution.TYPE, RemoveLifelineCommandContribution.class);
      binding.put(SetLifelineNameCommandContribution.TYPE, SetLifelineNameCommandContribution.class);
      binding.put(AddMessageCommandContribution.TYPE, AddMessageCommandContribution.class);
      binding.put(RemoveMessageCommandContribution.TYPE, RemoveMessageCommandContribution.class);
      binding.put(SetMessageNameCommandContribution.TYPE, SetMessageNameCommandContribution.class);
      binding.put(CopyInteractionCommandContribution.TYPE, CopyInteractionCommandContribution.class);
      binding.put(CopyLifelineWithMessagesCommandContribution.TYPE, CopyLifelineWithMessagesCommandContribution.class);
   }

   @Override
   protected void configureCodecs(final MultiBinding<CodecProvider> binding) {
      super.configureCodecs(binding);
      binding.add(UmlCodecProvider.class);
   }

   @Override
   protected void configureRoutings(final MultiBinding<Routing> binding) {
      super.configureRoutings(binding);
      // TODO: Enable it later
      // binding.add(UmlModelServerRouting.class);
   }
}
