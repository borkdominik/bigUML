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
package com.eclipsesource.uml.modelserver.core;

import org.eclipse.emfcloud.modelserver.common.Routing;
import org.eclipse.emfcloud.modelserver.common.utils.MapBinding;
import org.eclipse.emfcloud.modelserver.common.utils.MultiBinding;
import org.eclipse.emfcloud.modelserver.edit.CommandContribution;
import org.eclipse.emfcloud.modelserver.emf.common.ModelResourceManager;
import org.eclipse.emfcloud.modelserver.emf.common.ResourceSetFactory;
import org.eclipse.emfcloud.modelserver.emf.common.codecs.CodecProvider;
import org.eclipse.emfcloud.modelserver.emf.configuration.EPackageConfiguration;
import org.eclipse.emfcloud.modelserver.glsp.notation.commands.contribution.ChangeBoundsCommandContribution;
import org.eclipse.emfcloud.modelserver.glsp.notation.commands.contribution.ChangeRoutingPointsCommandContribution;
import org.eclipse.emfcloud.modelserver.notation.integration.EMSNotationModelServerModule;
import org.eclipse.emfcloud.modelserver.notation.integration.NotationPackageConfiguration;
import org.eclipse.glsp.server.emf.EMFIdGenerator;
import org.eclipse.glsp.server.emf.idgen.FragmentIdGenerator;
import org.eclipse.uml2.uml.resource.UMLResource;

import com.eclipsesource.uml.modelserver.core.codec.UmlCodecProvider;
import com.eclipsesource.uml.modelserver.core.commands.change_bounds.UmlChangeBoundsContribution;
import com.eclipsesource.uml.modelserver.core.commands.change_routing_points.UmlChangeRoutingPointsContribution;
import com.eclipsesource.uml.modelserver.core.resource.UmlNotationPackageConfiguration;
import com.eclipsesource.uml.modelserver.core.resource.UmlNotationResource;
import com.eclipsesource.uml.modelserver.core.resource.UmlPackageConfiguration;
import com.eclipsesource.uml.modelserver.core.routing.UmlModelServerRouting;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.manifest.ClassManifest;
import com.eclipsesource.uml.modelserver.uml.diagram.common_diagram.manifest.CommonManifest;
import com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.manifest.CommunicationManifest;
import com.google.inject.Singleton;

public class UmlModelServerModule extends EMSNotationModelServerModule {

   @Override
   protected void configure() {
      super.configure();
      // TODO: Somehow use this also in the other places in the commands
      bind(EMFIdGenerator.class).to(FragmentIdGenerator.class).in(Singleton.class);

      install(new CommonManifest());
      install(new CommunicationManifest());
      install(new ClassManifest());
   }

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
      binding.remove(ChangeBoundsCommandContribution.TYPE);
      binding.remove(ChangeRoutingPointsCommandContribution.TYPE);

      binding.put(UmlChangeBoundsContribution.TYPE, UmlChangeBoundsContribution.class);
      binding.put(UmlChangeRoutingPointsContribution.TYPE, UmlChangeRoutingPointsContribution.class);
   }

   @Override
   protected void configureCodecs(final MultiBinding<CodecProvider> binding) {
      super.configureCodecs(binding);
      binding.add(UmlCodecProvider.class);
   }

   @Override
   protected void configureRoutings(final MultiBinding<Routing> binding) {
      super.configureRoutings(binding);
      binding.add(UmlModelServerRouting.class);
   }
}
